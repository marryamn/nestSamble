import { Expose, Transform } from "class-transformer";
import { User } from "src/users/user.entity";

export class ReportDto{
    @Expose()
    id:number;

    @Expose()
    price:number;

    @Expose()
    year:number;

    @Expose()
    lng:number;

    @Expose()
    lat:number;

    @Expose()
    make:string;

    @Expose()
    mdel:string;

    @Expose()
    approved:Boolean;
    
    @Expose()
    mileage:number;

    @Transform(({obj})=>obj.user.id)
    @Expose()
    userId:number;
    @Transform(({obj})=>obj.user)
    @Expose()
    user:User;
}