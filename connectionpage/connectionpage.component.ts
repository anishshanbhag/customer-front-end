import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {ViewEncapsulation} from '@angular/core';
import Fingerprint2 from 'fingerprintjs2';
import {Observable} from 'rxjs/Rx';
import { timer } from 'rxjs/observable/timer';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Input } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Router, NavigationExtras} from "@angular/router";


var result1 = "";
var id1;

@Component({
  selector: 'app-connectionpage',
  templateUrl: './connectionpage.component.html',
  styleUrls: ['./connectionpage.component.css']
})

export class ConnectionpageComponent implements OnInit {
  [x: string]: any;
  stateForm: FormGroup;
  values = "";
  count = 0;
  states = [];
  productList = [];
	hideModal = true;
  showDropDown = false;
  disconnectDropDown = false;
  skipConnectClicked = false;
	timer1 = 0;
	alertDropDown = false;
  averageWaitingTime = "";
  checkPreviousRoom = false;
  customerData:string;
  id4="";
  feedbackButton = true;
  stateCheck:boolean;
  public id: number;
	public name: String;
	public details: String;
	public category: String;
  public sellingPrice : number;
  public mrpPrice : number;

  constructor(private route: ActivatedRoute,private modalService: NgbModal,private httpClient: HttpClient,private router:Router) {
    this.route.queryParams.subscribe(params => {
          this.id = params["id"];
          this.name = params["name"];
          this.details = params["details"];
          this.category = params["category"];
          this.sellingPrice = params["sellingPrice"];
          this.mrpPrice = params["mrpPrice"];
      });
      new Fingerprint2().get(function(result, components) {
          result1 = result;
      })

      this.subscription = Observable.interval(50)
        .subscribe(() => {
            this.requestRoomCheck();
        })

  }
   requestRoomCheck(){
     this.unsubscribeMe();
    const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    this.httpClient.post('http://104.155.137.69:9000/api/v1/room/ifRequestedRoomAlreadyThereForThisDevice',{'deviceId' : result1} , httpOptions)
     .subscribe((data: any) => {
       // console.log(data);
       this.id4 = JSON.parse(data.data).id;
       if(this.id4!=undefined){
         this.averageWaitingTime = JSON.parse(data.data).requestedTime;
         this.requestRoomDropDown = true;
         this.checkPreviousRoom = false;
         this.alertDropDown = false;
         this.disconnectDropDown = false;
         // console.log("Success");
         this.subscription = Observable.interval(this.timer1*1000/4)
           .subscribe(() => {
             this.httpClient.post('http://104.155.137.69:9000/api/v1/room/isSalesmanAllotted', {'id':id1}, httpOptions)
               .subscribe((data: any) => {
                 // let id = JSON.parse(data.data).id;
                 // if(id != undefined){
                 //   this.unsubscribeMe();
                 // }
                 if(data.response == 108203){
                     window.open('http://35.184.34.22:3000/'+id1,"_top");
                 }

                 // console.log(data);
               });
             });
       }
       else{
         // console.log("Fail");
         this.checkPreviousRoom = true;

       }
     });
  }
  ngOnInit() {
  }
  openVerticallyCentered(content) {
     this.requestRoomCheck();
     this.subscription = Observable.interval(1000)
       .subscribe(() => {
          if(this.checkPreviousRoom == true ){
            this.modalService.open(content, { centered: true });
          }
          this.unsubscribeMe();
        })
  }
  alertThis(){
      this.alertDropDown = !this.alertDropDown;
  }
  close(){
      this.hideModal = false;
  }
  connectToSalesman(name,number,open1){
    // console.log(name);
    // console.log(number);
    if(name == "" || number == ""){
      // console.log("Sc")
        this.modalService.open(open1, { centered: true });
    }
    else{
      // this.disconnectDropDown = true;
      this.httpClient.post('http://104.155.137.69:9000/api/v1/consumer/createConsumer', {
        "name": name,
        "phoneNumber": number,
        "deviceId" : result1,
        "productId" : this.id,
        "productName" : this.name
      })
      .subscribe((data: any) => {

            this.customerData = JSON.parse(data.data).id;
            localStorage.setItem('customer',this.customerData);
        });

             this.connectAgain();


    }
  }
  unsubscribeMe(){
      this.subscription.unsubscribe();
    }
  connectAgain(){
    this.feedbackButton = false;
      this.httpClient.post('http://104.155.137.69:9000/api/v1/room/createRoom', {
        "deviceId" : result1,
        "consumerId" : this.customerData
      })
      .subscribe((data: any) => {
        id1 = JSON.parse(data.data).id;
        if(id1!=undefined){
          this.disconnectDropDown = true;
          this.alertDropDown = true;
           this.timer1 = JSON.parse(data.data).averageWaitingTime;
            const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
              })
          };
          this.subscription = Observable.interval(this.timer1*1000/4)
            .subscribe(() => {
              this.httpClient.post('http://104.155.137.69:9000/api/v1/room/isSalesmanAllotted', {'id':id1}, httpOptions)
                .subscribe((data: any) => {
                  // let id = JSON.parse(data.data).id;
                  // if(id != undefined){
                  //   this.unsubscribeMe();
                  // }
                  if(data.response == 108203){
                    this.skipConnectClicked = true;
                      window.open('http://35.184.34.22:3000/'+id1,"_top");
                  }

                  // console.log(data);
                });
              });
          // Observable.interval(1000)
          //   .subscribe(() => {
          //     if(this.timer1>=0){
          //       this.timer1 = this.timer1-1;
          //     }
          //   });
        }
        else{
           this.alert.isVisible = true;
        }
      // console.log(data);
     });
  }

  removeRoom(){
    this.feebbackButton = true;
    const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    this.httpClient.post('http://104.155.137.69:9000/api/v1/room/deleteRoom', {'id':id1}, httpOptions)
      .subscribe((data: any) => {
        // console.log(data);
      })
      this.alertDropDown = false;
      // this.requestRoomDropDown = false;
      this.disconnectDropDown = false;
      this.checkPreviousRoom = true;
  }

  removeRoom1(){
    this.feedbackButton = true;
    const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    this.httpClient.post('http://104.155.137.69:9000/api/v1/room/deleteRoom', {'id':this.id4}, httpOptions)
      .subscribe((data: any) => {
        // console.log(data);
      })
      // this.alertDropDown = false;
      this.requestRoomDropDown=false;
      this.checkPreviousRoom = true;
      // this.disconnectDropDown = false;
  }

  goTo(){
    this.router.navigate(['']);
  }

  goToFeedbackPage(content){
    this.modalService.open(content, { centered: true });
  }
  moveToFeedback(){
    let navigationExtras: NavigationExtras = {
        queryParams: {
          "customerId":localStorage.getItem('customer')
        }
    };
      console.log("Yahoo");
      console.log(this.customerData);
    this.router.navigate(['feedback'],navigationExtras);
  }
  openPlaceCall(content){
    this.modalService.open(content, { centered: true });
  }
  moveToHome(){
    this.router.navigate(['']);
  }
  feebBackButton(){
    this.feedbackButton = false;
  }
}
