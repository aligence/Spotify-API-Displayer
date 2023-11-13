import { Component, OnInit, Input } from '@angular/core';
import { ResourceData } from '../../data/resource-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carousel-card',
  templateUrl: './carousel-card.component.html',
  styleUrls: ['./carousel-card.component.css']
})
export class CarouselCardComponent implements OnInit {
  @Input() resource:ResourceData;

  constructor(private router:Router) { }

  ngOnInit() {
  }

  getLocalURL(){
    if (this.resource && this.resource.id) {
      if(this.resource.category == "artist") {
      return `/artist/${this.resource.id}`;
      }
      else if(this.resource.category == "album") {
        return `/album/${this.resource.id}`;
      }
    }
    return '/';
  }
}
