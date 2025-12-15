import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';

@Injectable()
export class InternalApiService {
  private readonly BASE_URL = process.env.FASTAPI_URL;

  constructor(
    private readonly http: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  private createOnceUsedJwt() {
    const payload = {
      iss: 'nestJS',
    };
    return this.jwtService.sign(payload);
  }

  async postToFastApi<T>(path: string, data: any): Promise<T> {
    const url = `${this.BASE_URL}${path}`;
    const token = this.createOnceUsedJwt();

    const response = await firstValueFrom(
      this.http.post<T>(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );

    return response.data;
  }
}
