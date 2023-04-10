import { UseInterceptors,NestInterceptor,ExecutionContext,CallHandler } from "@nestjs/common";
import {Observable} from 'rxjs';
import{map} from 'rxjs/operators';
import { plainToClass } from "class-transformer";
import { UserDto } from "src/users/dtos/user.dto";

interface classConstructor{
    new (...args:any[]):{};
}

export function serialize(dto:classConstructor){
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor{
    constructor(private dto:any){}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        //Run sth before a request is handled.
        //by the request handler
        return next.handle().pipe(
            map((data:any)=>{
                //Run sth before the response is sent out
                return plainToClass(this.dto,data,{
                    excludeExtraneousValues:true
                })
            })
        )
    }
}