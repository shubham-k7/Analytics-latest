import { Component, OnInit } from '@angular/core';
import { ChartComponent } from 'angular2-highcharts';
import { Observable } from 'rxjs/Rx';
import { MenuItem } from 'primeng/components/common/api';
import { Message } from 'primeng/components/common/api';
import { ChartDataService } from '../../shared/services/chart-data.service';
import {SelectItem} from 'primeng/primeng';

declare var require: any;
var Highcharts = require('highcharts/highcharts');
var HighchartsMore = require('highcharts/highcharts-more');
var HighchartsDrilldown = require('highcharts/modules/drilldown');
var HighchartsExporting = require('highcharts/modules/exporting.src');
var HighchartsExportData = require('highcharts/modules/export-data.src');
HighchartsMore(Highcharts);
HighchartsDrilldown(Highcharts);
HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
    
    constructor(private chartDataService: ChartDataService){ }

    public getChartData(event: any,chartName: string): void {
            var comp=this,t;
            var x = chartName.split('-').slice(0,2);
            var kpi_name = x[0];
            var abc = x[1];
            t = this.drilldowns[kpi_name][chartName].length;
            var list = this.drilldowns[kpi_name][chartName].slice(1,t+1);
            list.push(event.point.name);
            // PAYLOAD for charts, name is a list of filters for charts
            var payload = {name: list,
                        series_name: event.point.series.name,
                        report_type: t.toString(),
                        chartName: chartName,
                        version_ids: [abc],
                        kpi_id: kpi_name};
            this.chartDataService.getChartData(payload).subscribe(series => {
                var chart;
                chart = comp.kpilist[payload.kpi_id][chartName];
                chart.hideLoading();
                if(event.points)
                {
                    chart.addSingleSeriesAsDrilldown(event.point,series[0]);
                    comp.drilldownsAdded++;
                    if(comp.drilldownsAdded===event.points.length) {
                        comp.drilldownsAdded=0;
                        chart.applyDrilldown();
                        if(chart.insertedTable)
                            chart.viewData();
                        comp.drilldowns[payload.kpi_id][chartName].push(payload.name.slice(-1)[0]);
                    }
                }
            },
            (err) => {
                alert(err);
                this.kpilist[payload.kpi_id][payload.chartName].hideLoading();
        }
        );
    }

    chartInit(kpi_name: string,conf: any): string{
        var comp = this;        // Do NOT REMOVE this. It's used inside chart confs
        var data = eval('(' + conf + ')')
        var chart = new Highcharts.Chart(data);
        this.kpilist[kpi_name][data.chart.name]=chart;
        chart.options.drilldown.activeDataLabelStyle = { "cursor": "pointer", "color": "#003399", "fontWeight": "bold", "textDecoration": "!none","text-transform": "uppercase" };
        chart.options.drilldown.activeAxisLabelStyle = { "cursor": "pointer", "color": "#003399", "fontWeight": "bold", "textDecoration": "!none","text-transform": "uppercase" };
        chart.options.drilldown.drillUpButton = {
                relativeTo: 'chart',
                position: {
                    align: "right",
                    y: 6,
                    x: -50
                },
                theme: {
                    fill: 'white',
                    'stroke-width': 1,
                    stroke: 'silver',
                    opacity: 0.5,
                    r: 0,
                    states: {
                        hover: {
                            fill: '#41739D',
                            style: {
							    color: "white"
						    },
                            opacity: 1
                        },
                        select: {
                            stroke: '#039',
                            fill: '#bada55'
                        }
                    }
                }
            };
        return data.chart.name;
    }

    getChart(id: string) {
        var kpi_name = id.split('-')[0]; 
        var chart = this.kpilist[kpi_name][id]; 
        chart.showLoading("Fetching Data...")
        // chart.hideData();
        this.chartDataService.getChart(id).subscribe(data => {
            var kpi_name = id.split('-')[0];
            var series = data[0].data;
            var chartid = this.chartInit(kpi_name,data[0].conf);
            this.drilldowns[kpi_name][chartid]=[];
            this.drilldowns[kpi_name][chartid].push("All");
            var chart= this.kpilist[kpi_name][id];
            for(var i =0; i <series.length;i++)
                chart.addSeries(series[i]);
            if(chart.insertedTable)
                chart.viewData();
        },
        (err) => {
            alert(err);
        }
        );
    }

    getCharts(kpi: any) {
        this.chartDataService.getCharts(kpi).subscribe(data => {
            var chartid;
            // for each chart in data, Init chart, add Mappings to chart, add series to chart
            for(var chart of data){
                chartid = this.chartInit(kpi.kpi_name,chart.conf);
                this.drilldowns[kpi.kpi_name][chartid]=[];
                this.drilldowns[kpi.kpi_name][chartid].push("All");
                this.filter[kpi.kpi_name][chartid] = '';
                for(var i =0; i<chart.data.length;i++){
                    this.kpilist[kpi.kpi_name][chartid].addSeries(chart.data[i]);
                }
            }
            // console.log(this.kpilist);
            // console.log(this.drilldowns);
        },
        (err) => {
            alert(err);
        });
    }
    
    getKPIs() {
        this.chartDataService.getKPIs().subscribe(res => {
            var kpis = res['data'],name;
            // for each kpi, create kpilist map, getCharts for each KPI. filter charts on kpi.version(Chartlists)
            for(var kpi of kpis){
                name=kpi.kpi_name;
                this.getCharts(kpi);
                this.kpilist[kpi.kpi_name] = new Map<string,any>();
                this.drilldowns[kpi.kpi_name] = new Map<string,string[]>();
                this.filter[kpi.kpi_name] = new Map<string,string>();
           }
        },
        (err)=>{
            alert(err);
        });
    }

    drilldownsAdded = 0;
    kpilist: Map<string,any> = new Map();
    drilldowns: Map<string,any> = new Map();
    filter: Map<string,any> = new Map();
    ngOnInit() {
        this.drilldownsAdded = 0;
        this.getKPIs();
    }
}
