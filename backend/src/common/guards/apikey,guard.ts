import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private configService: ConfigService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const clientKey = request.headers['x-api-key'];
        const serverKey = this.configService.get('API_KEY');
        if (!clientKey || clientKey !== serverKey) {
            throw new UnauthorizedException();
        }
        return true;
    }
}