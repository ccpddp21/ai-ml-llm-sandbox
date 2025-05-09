import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-qualification-score',
  templateUrl: './qualification-score.component.html',
  styleUrls: ['./qualification-score.component.scss']
})
export class QualificationScoreComponent implements OnInit {
  @Input() score: number = 0;
  @Input() showLabel: boolean = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  constructor() { }

  ngOnInit(): void {
  }

  getScoreClass(): string {
    if (this.score >= 80) return 'high-score';
    if (this.score >= 60) return 'medium-score';
    return 'low-score';
  }

  getScoreText(): string {
    if (this.score >= 80) return 'High Quality';
    if (this.score >= 60) return 'Medium Quality';
    return 'Low Quality';
  }
}
