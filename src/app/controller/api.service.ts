import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  post(data : any){
    return this.http.post<any>("http://localhost:3000/userDetails/",data)
    .pipe(map((res:any)=>{
      return res;
    }))
  }
  postTeam(data : any){
    return this.http.post<any>("http://localhost:3000/teamDetails/",data)
    .pipe(map((res:any)=>{
      return res;
    }))
  }
  delete(id : number){
    return this.http.delete<any>("http://localhost:3000/teamDetails/"+id)
    .pipe(map((res:any)=>{
      return res;
    }))
  }
  update2(data: any,id:any ){
   
    return this.http.put<any>("http://localhost:3000/ticketdetails/"+id,data)
    .pipe(map((res:any)=>{
      return res;
    }))
  }
  getuser(email:any){
    return this.http.get<any>("http://localhost:3000/userDetails/?email="+email)
    .pipe(map((res)=>{
      return res;
    }))
  }
  getAccno(accNo:any){
    return this.http.get<any>("http://localhost:3000/AccountDetails/?CardNO="+accNo)
    .pipe(map((res)=>{
      return res;
    }))
  }
   getChartData(){
    return this.http.get<any>("http://localhost:3000/CompanyProfit/")
    .pipe(map((res)=>{
      return res;
    }))
  }
getLogin(email:any ,password:any)
{
  return this.http.get<any>('http://localhost:3000/userDetails?email='+email+'&password='+password)
    .pipe(map((res)=>{
      return res;
    }))
}
update(data : any,id: any ){
   
  return this.http.put<any>("http://localhost:3000/userDetails/"+id,data)
  .pipe(map((res:any)=>{
    return res;
  }))
}
mgrUpdate(data : any,id: any ){
   
  return this.http.put<any>("http://localhost:3000/managerDetails/"+id,data)
  .pipe(map((res:any)=>{
    return res;
  }))
}
adminUpdate(data : any,id: any ){
   
  return this.http.put<any>("http://localhost:3000/teamDetails/"+id,data)
  .pipe(map((res:any)=>{
    return res;
  }))
}
post1(data : any){
  return this.http.post<any>("http://localhost:3000/InvestDetails/",data)
  .pipe(map((res:any)=>{
    return res;
  }))
}
get1(){
  return this.http.get<any>('http://localhost:3000/InvestDetails/')
  .pipe(map((res)=>{
    return res;
  }))
}
}
