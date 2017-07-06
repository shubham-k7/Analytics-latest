import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// -----Component Imports-----
import { ChartsRoutingModule } from './charts-routing.module';
import { ChartsComponent } from './charts.component';
import { PageHeaderModule } from '../../shared';
// -----Highcharts Imports-----
import { ChartModule} from 'angular2-highcharts';
import { ChartComponent} from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts';
declare var require: any;
export function highchartsFactory() {
    const hc = require('highcharts');
    const hcm = require('highcharts/highcharts-more');
    const dd = require('highcharts/modules/drilldown');
    const hce = require('highcharts/modules/exporting');
    const hced = require('highcharts/modules/export-data.src');
    hcm(hc);
    dd(hc);
    hce(hc);
    hced(hc);
    return hc;
}
// -----Provider Imports-----
import { ChartDataService } from './chart-data.service';
import { ChartFilterService } from './chart-filter.service';
// -----Applet Imports-----
import {AutoCompleteModule} from 'primeng/components/autocomplete/autocomplete';
import { GrowlModule } from 'primeng/components/growl/growl';
import { MdSelectModule,MdInputModule } from '@angular/material';
import { Md2Module} from 'md2';

@NgModule({
    imports: [
        CommonModule,
        ChartsRoutingModule,
        PageHeaderModule,
        FormsModule,
        ChartModule,
        AutoCompleteModule,
        GrowlModule,
        MdSelectModule,
        MdInputModule,
        Md2Module,
    ],
    declarations: [ChartsComponent],
    providers: [ChartDataService,ChartFilterService,{
        provide: HighchartsStatic,
        useFactory: highchartsFactory
    }]
})
export class ChartsModule { }
