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
import {Router, NavigationExtras} from "@angular/router";

interface product {
	id: number;
	name: String;
	details: String;
	category: String;
	sellingPrice : number;
	mrpPrice : number;
}

var pdt: product;
var result1 = "";
var id1;
var name;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  [x: string]: any;
  stateForm: FormGroup;
  values = "";
  count = 0;
  pdt: product;
  states = [];
  productList = [];
	hideModal = true;
	name = "ANish";
  showDropDown = false;
	timer1 = 0;
	alertDropDown = false;
	averageWaitingTime = "";
	id4 = "";

  videos: any[] = [
    // {
    //   check: true,
    //   video: 'https://www.youtube.com/embed/a5k2eqEn1MU?autoplay=1&showinfo=0&controls=0&mute=1'
    // }
    // ,
    {
      check:true,
      video : 'https://www.youtube.com/embed/xDql2LK_q2Y?autoplay=1&showinfo=0&controls=0&mute=1'
    }
  ]

  constructor(public sanitizer: DomSanitizer, private fb: FormBuilder, private httpClient: HttpClient,private modalService: NgbModal,private router: Router) {
				this.initForm();
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
				console.log(data);
				this.id4 = JSON.parse(data.data).id;
				if(this.id4!=undefined){
		 			this.averageWaitingTime = JSON.parse(data.data).requestedTime;
		 			this.alertDropDown = true;
					this.subscription = Observable.interval(3000)
            .subscribe(() => {
              this.httpClient.post('http://104.155.137.69:9000/api/v1/room/isSalesmanAllotted', {'id':this.id4}, httpOptions)
                .subscribe((data: any) => {
                  if(data.response == 108203){
										this.unsubscribeMe();
                    window.open('https://joeydash.herokuapp.com/'+this.id4,"_top");
                  }
									console.log(data);
                });
              });
		 		}
		 	});
	 }
	 unsubscribeMe(){
			 this.subscription.unsubscribe();
		}

  initForm(): FormGroup {
		return this.stateForm = this.fb.group({
			search: [null]
		})
	}

  ngOnInit(){
  }

  // onEnded(i){
  //   if(this.videos.length>i){
  //     this.videos[i+1].check=true;
  //   }
	//
  // }

		  displayProduct(value) {
		  		for (let i = 0; i < this.productList.length; i++) {
		  			if (this.productList[i].productName === value) {
		  				this.pdt = {
		  					id: this.productList[i].id,
		  					name: this.productList[i].productName,
		  					details: this.productList[i].productDetails,
		  					category: this.productList[i].productCategory,
								sellingPrice : this.productList[i].productSellingPrice,
								mrpPrice : this.productList[i].productMRP
		  				};
		  			}
		  		}
					this.goToConnection();
		  	}
			clicked() {
				this.showDropDown = !this.showDropDown;
			}
			getSearchValue() {
					return this.stateForm.value.search;
			}
			selectValue(value) {
				this.stateForm.patchValue({ "search": value });
				this.showDropDown = false;
				this.displayProduct(value);
			}
			closeDropDown() {
				this.showDropDown = !this.showDropDown;
			}

			openDropDown() {
				this.showDropDown = false;
			}
		  onKey(event: any) {
					this.values = event.target.value;
					const httpOptions = {
						headers: new HttpHeaders({
							'Content-Type': 'application/json'
						})
					};
					if (this.values.length >= 1) {
						this.httpClient.get('http://104.155.137.69:9000/api/v1/product/searchProduct?query='+this.values,httpOptions)
						 	.subscribe((data: any) => {
			          console.log(data);
						 		this.states = [];
						 		this.productList = [];
						 		let sugesstedProductDetailList = JSON.parse(data.data);
						 		for (let i = 0; i < sugesstedProductDetailList.length; i++) {
						 			this.productList.push(sugesstedProductDetailList[i]);
						 			this.states.push(sugesstedProductDetailList[i].productName);
								}
							});
						}
				}
				openVerticallyCentered(content) {
    			this.modalService.open(content, { centered: true });
  			}
				alertThis(){
						this.alertDropDown = !this.alertDropDown;
				}
				openVertically(content){
					this.modalService.open(content, { centered: true });
				}
				close(){
						this.hideModal = false;
				}
				// @ViewChild('content1')  public modal: ModalDirective;
				alert = {
    				isVisible : false,
    				message : 'No cusomters as of now'
  			};
				connectToSalesman(name,number){
					this.httpClient.post('http://104.155.137.69:9000/api/v1/consumer/createConsumer', {
						"name": name,
						"phoneNumber": number,
						"deviceId" : result1
					})
					.subscribe((data: any) => {
						let id = JSON.parse(data.data).id;
						if(id!=undefined){
							this.alertDropDown = true;
							this.timer1 = JSON.parse(data.data).averageWaitingTime;
							// var number = Observable.timer(this.timer1*1000);
							// number.subscribe(x=>{
							// 	window.open('https://joeydash.herokuapp.com/'+id,"_top");
							// })
							const httpOptions = {
      				headers: new HttpHeaders({
        					'Content-Type': 'application/json',
      					})
    					};
							this.subscription = Observable.interval(3000)

								.subscribe(() => {
                  this.httpClient.post('http://104.155.137.69:9000/api/v1/room/isSalesmanAllotted', {'id':id}, httpOptions)
                    .subscribe((data: any) => {
                      let id = JSON.parse(data.data).id;
                      if(id != undefined){
                        this.unsubscribeMe();
                      //   this.data = localStorage.getItem('staff');
                      //   this.authToken1 = JSON.parse(JSON.parse(this.data).data).authToken;
                      //   const httpOptions = {
                      //     headers: new HttpHeaders({
                      //       'Content-Type': 'application/json',
                      //       'authToken': this.authToken1
                      //     })
                      //   };
                      //   this.httpClient.post('http://10.0.0.255:9000/api/v1/salesman/setOccupied', '', httpOptions)
                      //     .subscribe((data: any) => {
                      //        // console.log(data);
                      //        window.open('https://joeydash.herokuapp.com/'+id,"_top");
                      //     });
                      // }
											if(data.response == 108203){
													window.open('https://joeydash.herokuapp.com/'+id,"_top");
											}}
                    });
								});
							Observable.interval(1000)
								.subscribe(() => {
									if(this.timer1>=0){
										this.timer1 = this.timer1-1;
									}
								});
							console.log(this.timer1);
						}else{
 							this.alert.isVisible = true;
						}
					});
				}

				connectAgain(){
					this.httpClient.post('http://104.155.137.69:9000/api/v1/room/createRoom', {
						"deviceId" : result1
					})
					.subscribe((data: any) => {
						let id = JSON.parse(data.data).id;
						if(id!=undefined){
							this.alertDropDown = true;
							 this.timer1 = JSON.parse(data.data).averageWaitingTime;
							 // if(this.timer1>1){
								//  	this.modal.hide;
							 // }
								// var number = Observable.timer(this.timer1*1000);
								// number.subscribe(x=>{
								// 	window.open('https://joeydash.herokuapp.com/'+id,"_top");
								// })
								const httpOptions = {
	      				headers: new HttpHeaders({
	        					'Content-Type': 'application/json',
	      					})
	    					};
								this.subscription = Observable.interval(this.timer1*1000/4)
									.subscribe(() => {
	                  this.httpClient.post('http://104.155.137.69:9000/api/v1/room/isSalesmanAllotted', {'id':id}, httpOptions)
	                    .subscribe((data: any) => {
	                      // let id = JSON.parse(data.data).id;
	                      // if(id != undefined){
	                      //   this.unsubscribeMe();
	                      //   this.data = localStorage.getItem('staff');
	                      //   this.authToken1 = JSON.parse(JSON.parse(this.data).data).authToken;
	                      //   const httpOptions = {
	                      //     headers: new HttpHeaders({
	                      //       'Content-Type': 'application/json',
	                      //       'authToken': this.authToken1
	                      //     })
	                      //   };
	                      //   this.httpClient.post('http://10.0.0.255:9000/api/v1/salesman/setOccupied', '', httpOptions)
	                      //     .subscribe((data: any) => {
	                      //        // console.log(data);
	                      //        window.open('https://joeydash.herokuapp.com/'+id,"_top");
	                      //     });
	                      // }
	                      if(data.response == 108203){
														window.open('https://joeydash.herokuapp.com/'+id,"_top");
												}
	                    });
										});
								Observable.interval(1000)
    							.subscribe(() => {
										if(this.timer1>=0){
											this.timer1 = this.timer1-1;
										}
    							});
					 		}
							else{
								 this.alert.isVisible = true;
							}
						console.log(data);
					 });
				}
			// connectionPage(){
			// 	this.hideModal = false;
			// 	this.router.navigate(['connection']);
			// }

			goToConnection(){
				let navigationExtras: NavigationExtras = {
            queryParams: {
							"id": this.pdt.id,
							"name": this.pdt.name,
							"details": this.pdt.details,
							"category":this.pdt.category,
							"sellingPrice":this.pdt.sellingPrice,
							"mrpPrice":this.pdt.mrpPrice
            }
        };
				this.router.navigate(['connection'],navigationExtras);
			}
			removeRoom(){
		    const httpOptions = {
		    headers: new HttpHeaders({
		        'Content-Type': 'application/json',
		      })
		    };
		    this.httpClient.post('http://104.155.137.69:9000/api/v1/room/deleteRoom', {'id':this.id4}, httpOptions)
		      .subscribe((data: any) => {
		        console.log(data);
		      })
					this.alertDropDown=false;
		  }
}
