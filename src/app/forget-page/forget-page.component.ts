import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup,FormBuilder, FormControl,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../controller/api.service';
import emailjs from 'emailjs-com';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-forget-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './forget-page.component.html',
  styleUrl: './forget-page.component.css'
})
export class ForgetPageComponent implements OnInit {
public captchaValue:any;
public forgetform !: FormGroup;
public questionform!:FormGroup;
public otpform!:FormGroup
public resetform !:FormGroup;
public invalidCaptcha=false;
public emailCheck=false;
public noCaptcha=false;
public sectionOne=false;
public section=true;
public sectionTwo =false;
public nofounduser=false;
public incorrectans=false;
public incorrectansone=false;
public incorrectotp=false;
public sectionThree=false;
public passCheck=false;
public userDetails:any=[];
  constructor(private form: FormBuilder, private router: Router, private http: HttpClient,private api: ApiService ,private ansform:FormBuilder,private otp:FormBuilder,private reset:FormBuilder) {
    this.forgetform = this.form.group({
      'email': ['',Validators.compose([Validators.required,Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')])],
      'Captchatext':['',Validators.compose([Validators.required])]
    })
    this.questionform=this.ansform.group({
      'ansone': ['',Validators.compose([Validators.required,])],
      'anstwo': ['',Validators.compose([Validators.required,])],
   
    
    
    })
    this.otpform=this.otp.group({
      'otpval': ['',Validators.compose([Validators.required,])],
      
      
      })
      this.resetform=this.reset.group({
        'password': ['',Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(8),Validators.pattern('^[A-Za-z]+$')])],
        'conpassword': ['',Validators.compose([Validators.required])],
      })
   }

  ngOnInit(): void {
    this.createCaptcha();
  }
  createCaptcha(){
    var alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V'
    ,'W','X','Y','Z','1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i',
    'j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', '!','@','#','$','%','^','&','*','+'];
    var a = alpha[Math.floor(Math.random()*71)];
    var b = alpha[Math.floor(Math.random()*71)];
    var c = alpha[Math.floor(Math.random()*71)];
    var d = alpha[Math.floor(Math.random()*71)];
    var e = alpha[Math.floor(Math.random()*71)];
    var f = alpha[Math.floor(Math.random()*71)];

    this.captchaValue = a+b+c+d+e+f;

  
    console.log("hi");
  }
  validCaptcha()
  {
    var stg1 = <HTMLInputElement>document.getElementById('captcha')
    var val=stg1.value;
    var stg2 =  <HTMLInputElement>document.getElementById('textinput')
 var val1=stg2.value;
 console.log("the value ",val1);
 console.log("the cap value"+val)
    if(!val1) {

 this.noCaptcha=true;


    } 
    else if(val1){
      this.noCaptcha=false;
    }
    
   if(this.captchaValue != val1){
    this. invalidCaptcha=true;
    
    } 
    if (this.captchaValue === val1) {
    this. invalidCaptcha=false;

  }
  }
  checkEmail(){
    
    this.http.get<any>('http://localhost:3000/userDetails?email='+this.forgetform.value.email)
    .subscribe(res=>{
      var check = res.find((a:any)=>{
        return a.email === this.forgetform.value.email 
      });
      if(!check){
        this.emailCheck=true;
       }
       else{
        this.emailCheck=false;
       }
    },err=>{
      alert('something went wrong');
    })
}
continue(){
  console.log("inside section function")

  this.http.get<any>('http://localhost:3000/userDetails?email='+this.forgetform.value.email)
  .subscribe(res=>{
    var check = res.find((b:any)=>{
      return b.email === this.forgetform.value.email
    });
    if(check){
      localStorage.setItem('userpage',JSON.stringify(check));
      this.userDetails.push(check);
      console.log(this.userDetails[0])
      this.sectionOne=true;
      this.section=false;
      this.sectionThree=false;
    }else{
      alert('user not found');
      this.nofounduser=true;
    }
  })
}
getPasswordPage()
{
  this.sectionOne=false;
  this.section=false;
  this.sectionThree=true;
}
correctansone(){
    
  if(this.userDetails[0].answerOne != this.questionform.value.ansone)
  {
    this.incorrectans=true;
  }

else{
  this.incorrectans=false;

}

}
correctanstwo(){
    
  if(this.userDetails[0].answertwo != this.questionform.value.anstwo)
  {
    this.incorrectansone=true;
  }

else{
  this.incorrectansone=false;

}

}
CheckOtp()
{
  if(this.otpform.value.otpval != this.userDetails[0].otp)
    {
    
      this.incorrectotp=true;
    }
    else{
      this.incorrectotp=false;
    
    }
}
getOTP()
{
  this.section=false;
  this.sectionOne=false;
  this.sectionTwo=true;
  alert("OTP send Succesfully your gmail")
  this.sendmail();
}
checkPassword(){
  var pass=this.resetform.value.password;
  var conpass=this.resetform.value.conpassword;
  if(pass != conpass)
  {
    this.passCheck=true;
  }
  else{
    this.passCheck=false;
  }
}
changepass()
{
  console.log("inside change pass ")
  this.http.get<any>('http://localhost:3000/userDetails?email='+this.userDetails[0].email)
  .subscribe(res=>{
    var check = res.find((c:any)=>{
      return c.password = this.resetform.value.password,
      c.conpassword=this.resetform.value.conpassword;
    });
    if(check){
console.log(check)
      this.api.update(check,this.userDetails[0].id)    
       
       .subscribe(res=>{
        alert("Updated Successfully");
       let ref = document.getElementById('cancel')
       ref?.click();
       this.router.navigate(['/login']);
      })
   }
     else{
      

     }
  },err=>{
    alert('something went wrong');
  })
  
  


}

sendmail(){

  var params ={
    from_name:this.userDetails[0].email,
    to_name:this.userDetails[0].otp,
  }
  console.log(params);
emailjs.send("service_07ettas","template_kpaerqr",params,'2xvKv0Zyj81VtKI4f').then(function (res)
{
alert("We have sent OTP to Your Register Email Id ");
})

}
}
