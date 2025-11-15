import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '@repo/types';

/**
 * JWT 인증 전략 클래스
 *
 * 이 클래스는 NestJS의 Passport를 사용하여 JWT 토큰 기반 인증을 처리합니다.
 * 주요 역할:
 * 1. HTTP 요청에서 JWT 토큰을 추출
 * 2. JWT 토큰의 유효성 검증 (서명, 만료시간 등)
 * 3. 토큰의 payload에서 사용자 정보를 추출하여 DB에서 실제 사용자 존재 여부 확인
 * 4. 인증된 사용자 정보를 요청 객체에 첨부
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    // 환경변수에서 JWT_SECRET 가져오기
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Passport JWT Strategy 설정
    super({
      // 1. 토큰 추출 방법: Authorization 헤더에서 'Bearer <token>' 형태로 추출
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. 만료된 토큰 거부: true로 설정하면 만료된 토큰도 허용 (보안상 위험)
      ignoreExpiration: false,

      // 3. JWT 서명 검증용 비밀키: 토큰이 우리 서버에서 발급된 것인지 확인
      secretOrKey: jwtSecret,
    });
  }

  /**
   * JWT 토큰이 유효할 때 호출되는 메서드
   *
   * Passport가 JWT 토큰의 서명과 만료시간을 먼저 검증한 후,
   * 이 메서드가 호출되어 추가적인 사용자 검증을 수행합니다.
   *
   * @param payload - JWT 토큰에서 디코딩된 페이로드 (로그인 시 저장한 데이터)
   * @returns AuthenticatedUser - 인증된 사용자 정보 (req.user에 저장됨)
   */
  async validate(payload: {
    email: string; // 사용자 이메일
    sub: number; // subject: 사용자 ID (JWT 표준에서 sub은 주체를 의미)
  }): Promise<AuthenticatedUser> {
    // DB에서 실제 사용자가 존재하는지 확인
    // 이 단계가 중요한 이유:
    // 1. 사용자가 삭제되었을 수 있음
    // 2. 사용자가 비활성화되었을 수 있음
    // 3. 토큰은 유효하지만 사용자 상태가 변경되었을 수 있음
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다');
    }

    return {
      id: user.id,
      nickname: user.nickname,
    };
  }
}
