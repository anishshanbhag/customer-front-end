import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feedback-page',
  templateUrl: './feedback-page.component.html',
  styleUrls: ['./feedback-page.component.css']
})
export class FeedbackPageComponent implements OnInit {
  radio5:String;
  radio1:String;
  radio2:String;
  radio3:String;
  radio4:String;
  radio6:String;
  customerData:String;

  constructor(private route: ActivatedRoute,private router:Router,private httpClient: HttpClient) {
    this.route.queryParams.subscribe(params => {
          this.customerData = params["customerId"];
      });

   }

  ngOnInit() {
  }

  submitForm(){
    this.httpClient.post('http://104.155.137.69:9000/api/v1/feedback/giveFeedback', {
      "id" : this.customerData,
      "technicalKnowledge" : this.radio1,
      "communicationSkill" : this.radio2,
      "conveyIdeas" : this.radio3,
      "trustFactor" : this.radio4,
      "satisfactionFactor" : this.radio5,
      "sangeethaInitiative" : this.radio6
    })
    .subscribe((data: any) => {
          console.log(data);
          this.router.navigate(['']);
      });
  }
}
