import {Test} from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, Catch, NotFoundException } from '@nestjs/common';

describe('AuthService',()=>{
    let service:AuthService;
    let fakeUserService:Partial<UsersService>;

    beforeEach(async ()=>{
        //create a fake copy of the users service
        const users:User[]=[];
        fakeUserService={
            find:(email:string)=>{const filteredUsers=users.filter(user=>user.email===email)
            return Promise.resolve(filteredUsers)},
            create:(email:string,password:string)=>
           {
            const user={id:Math.floor(Math.random()*999999),email,password }as User;
            users.push(user)
            return Promise.resolve(user);
        }
    }
        const module=await Test.createTestingModule({
            providers:[AuthService,
            {
                provide:UsersService,
                useValue:fakeUserService
            }],
    
        }).compile();
    
         service=module.get(AuthService);
    
    })
    
    it('can create an instance of auth service',async () => {
        expect(service).toBeDefined();
    })

    it('creates a new user with a salted and hashed password',async()=>{

        const user=await service.signup('test@gmail.com','123456');

        expect(user.password).not.toEqual('123456');
        const [salt,hash]=user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();

    });

    it('throws an error if user signs up with email that is in use',async()=>{

        //fakeUserService.find= () =>Promise.resolve([{id:1,email:'a@gmail.com',password:'123456'} as User]);
        await service.signup('aa@gmail.com','123456');

        try{
            await expect(service.signup('aa@gmail.com','123456')).rejects.toThrow(
                BadRequestException)

        }catch(err){
           
        }
    });
    
    it('throws if signin is called with an unused email',async()=>{
        try{
           await expect(service.signin('aa@gmail.com','123456')).rejects.toThrow(NotFoundException)
        }catch(err){

        }
    })

    it('throws if an invalid password is provided',async()=>{
       // fakeUserService.find=()=>Promise.resolve([{email:'aa@test.com',password:'123456'} as User]);
       await service.signup('aa@gmail.com','123456');
     

        
            //await service.signin('aa@gmail.com','123456')
        await expect(service.signin('aa@gmail.com','12345')).rejects.toThrowError(BadRequestException);
 
       
    })

    it('returns a user if correct password is provided',async()=>{
        //fakeUserService.find=()=>Promise.resolve([{  email:'aa@gmail.com', password:'123456' }as User]);

        await service.signup('aa@gmail.com','123456');

        const user=await service.signin('aa@gmail.com','123456');
        expect(user).toBeDefined();
    })
});

