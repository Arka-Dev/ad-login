import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { isEmail } from "class-validator";
import * as ldap from 'ldapjs';

@Injectable()
export class MjActiveDirectory {

    private _ldapHost = '172.16.2.5';
    private _ldapPort = 389;
    private _domainEmail = 'metaljunction.com';

    protected client: any;

    async connect(){
        try {
            this.client = ldap.createClient({ url: `ldap://${this._ldapHost}:${this._ldapPort}`, reconnect: true});
        } catch(err) {
            console.log('Error:', err)
        }        
    }

    async authorize(username: string, password: string): Promise<{status:boolean, message: string}>{
        let status: boolean, message: string = '', user: any = {};
        if(!isEmail(username)){
            username = `${username}@${this._domainEmail}`;
        }
        try{
            status = await this.bind(username, password);
            try {
                user = await this.getUser(username);
                console.log('+++++', user);
            } catch(err) {
                console.log('Error', err);
            }
        }
        catch(err){
            message = err;
            status = false;
        }
        return {status, message};
    }

    async bind(username: string, password: string): Promise<any> {
        return new Promise((resolve, reject)=> {
            this.client.bind(username, password, (err) => {
                if (err) {
                    console.log('Authentication failed', err);
                    reject(err.lde_message);
                } else {
                    console.log('Authentication successful');
                    resolve(true);
                }
             });
        })
    }

    async getUser(username: string): Promise<any> {
        const options = {
            scope: "sub",
            filter: `(email=brojendra.das@mjunction.in)`
        };
        return this.client.search('dc=metaljunction,dc=com', options, (err, res) => {
            if (err) {
                console.log('Failed to search', err);
            } 
            
            res.on('searchEntry', entry => {
                console.log(entry.object);
            });
            res.on('searchReference', referral => {
                console.log('referral: ' + referral.uris.join());
            });
            res.on('error', err => {
                console.error('error: ' + err.message);
            });
            res.on('end', result => {
                console.log(result);
            });
            
        });
    }

}