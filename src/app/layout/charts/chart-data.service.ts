import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
 
@Injectable()
export class ChartDataService {
    constructor(private http: Http){   }
    
    private extractData(res: Response) {
        let body = res.json();
        console.log(body);
        return body || { };
    }
    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getKPIs(): Observable<any> {
        var url = 'http://52.70.207.115:8087/api/v1/kpi/';
        let headers = new Headers({'content-type': 'application/json'});
        headers.append('Authorization', 'Token 6a408c2bc8db8c8dc151a6390ab631f3c1931f6f');
        let options = new RequestOptions({ headers: headers});
        return this.http.get(url,options).map(this.extractData).catch(this.handleError);
    }
    getCharts(kpi: any): Observable<any> {
        var url = 'http://52.70.207.115:8087/api/v1/inscan/report/';
        let headers = new Headers({'content-type': 'application/json'});
        headers.append('Authorization', 'Token 6a408c2bc8db8c8dc151a6390ab631f3c1931f6f');
        let options = new RequestOptions({ headers: headers});
        var payload = JSON.stringify({kpi_id: kpi.kpi_name,version_ids: kpi.versions,report_type: "0",name: [],series_name: "",chartConfigs: {_filter: null}});
        console.log(payload);
        return this.http.post(url,payload,options).map(this.extractData).catch(this.handleError);
        /*return this.http.get('assets/files/data.json').map(res => {
            console.log(res);
        }).catch(this.handleError);*/
    }
    getDrilldownChart(payload: any): Observable<any> {
        var url = 'http://52.70.207.115:8087/api/v1/inscan/report/';
        let headers = new Headers({'content-type': 'application/json'});
        headers.append('Authorization', 'Token 6a408c2bc8db8c8dc151a6390ab631f3c1931f6f');
        let options = new RequestOptions({ headers: headers});
        // var x = id.split('-');
        // var payload = JSON.stringify({kpi_id: x[0],version_ids: [x[1]],report_type: "0",name: [],series_name: "",datef: (df)?df:null});
        payload = JSON.stringify(payload); 
        console.log(payload);
        return this.http.post(url,payload,options).map(this.extractData).catch(this.handleError);
    }

    getChartData(payload: any): Observable<any> {
        var url = 'http://52.70.207.115:8087/api/v1/inscan/report/';
        let headers = new Headers({'content-type': 'application/json'});
        headers.append('Authorization', 'Token 6a408c2bc8db8c8dc151a6390ab631f3c1931f6f');
        let options = new RequestOptions({ headers: headers});
        console.log(JSON.stringify(payload));
        return this.http.post(url, JSON.stringify(payload),options).map(this.extractData).catch(this.handleError);
    }

}
