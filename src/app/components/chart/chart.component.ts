import { Component, Input, OnChanges } from '@angular/core';
import { Stat } from '../../models/stat';
import { Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ViewMode } from '../../models/view-mode';
import { DATE_FORMAT } from '../../globals';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnChanges {
  @Input() stats: Map<string, Stat[]>;
  @Input() selectedRepos: string[];
  @Input() toDate: Moment;
  @Input() fromDate: Moment;
  @Input() viewMode: ViewMode;

  chartLabelsXAxis: Label[] = [];
  chartDataSets: ChartDataSets[] = [];
  chartOptions: ChartOptions;

  ngOnChanges(): void {
    this.resetChart();
    this.initChartOptions();
    this.initChart();
  }

  initChart(): void {
    const dates = this.getDateListBetween();
    this.chartLabelsXAxis = dates;

    for (const repo of this.stats.keys()) {
      if (this.selectedRepos.length > 0 && this.selectedRepos.includes(repo)) {
        const statArr: Stat[] = this.stats.get(repo);
        for (const date of dates) {
          if (!statArr.map(stat => stat.statDate).includes(date)) {
            statArr.push({totalViews: 0, statDate: date, uniqueViews: 0});
          }
        }
        this.stats.set(
          repo,
          statArr.sort((a, b) => {
            return moment(a.statDate).diff(moment(b.statDate), 'day');
          }));
      }
    }

    for (const repo of this.selectedRepos) {
      if (this.selectedRepos.length > 0 && this.selectedRepos.includes(repo)) {
        const repoChartDataSets: ChartDataSets = {
          label: repo, data: [], lineTension: 0, borderWidth: 1
        };
        for (const stat of this.stats.get(repo)) {
          (repoChartDataSets.data as any[]).push({x: stat.statDate, y: stat[this.viewMode?.apiName]});
        }
        this.chartDataSets.push(repoChartDataSets);
      }
    }
  }

  resetChart(): void {
    this.chartDataSets = [];
    this.chartLabelsXAxis = [];
  }

  private getDateListBetween(): string[] {
    const dates: string[] = [];
    for (const currentDate = moment(this.fromDate);
         currentDate.isSameOrBefore(this.toDate, 'day');
         currentDate.add(1, 'day')) {
      dates.push(currentDate.format(DATE_FORMAT));
    }
    return dates;
  }

  private initChartOptions(): void {
    this.chartOptions = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Date'
          },
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'YYYY-MM-DD'
            }
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: (this.viewMode === ViewMode.TOTAL ? 'Total' : 'Unique') + ' views'
          },
          ticks: {
            beginAtZero: true
          }
        }]
      },
    };
  }
}
