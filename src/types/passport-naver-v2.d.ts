declare module 'passport-naver-v2' {
  import { Strategy as PassportStrategy } from 'passport';

  export interface StrategyOption {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
  }

  export interface Profile {
    provider: string;
    id: string;
    email: string;
    nickname: string;
    profile_image: string;
  }

  export class Strategy extends PassportStrategy {
    constructor(
      options: StrategyOption,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any, info?: any) => void,
      ) => void,
    );
    constructor(options: StrategyOption);
  }
}
