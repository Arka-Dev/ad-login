import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { isEmail } from "class-validator";
import * as ldap from 'ldapjs';

@Injectable()
export class MjActiveDirectory {

    private _ldapHost = '172.16.2.5';
    private _ldapPort = 389;
    private _domainEmail = 'metaljunction.com';
    private _primaryDomainEmail = 'mjunction.in';

    protected client: any;

    async connect(){
        try {
            this.client = ldap.createClient({ url: `ldap://${this._ldapHost}:${this._ldapPort}`, reconnect: true});
        } catch(err) {
            console.log('Error:', err)
        }        
    }

    async authorize(username: string, password: string): Promise<{status:boolean, message: string, user: any}>{
        let status: boolean, message: string = '', user: any = {}, tempName = username;
        if(!isEmail(username)){
            tempName = `${username}@${this._primaryDomainEmail}`;
            username = `${username}@${this._domainEmail}`;
        }
        try{
            status = await this.bind(username, password);
            try {
                user = await this.getUser(tempName);
                console.log('+++++', user);
                user = JSON.parse(user);
            } catch(err) {
                console.log('Error', err);
            }
        }
        catch(err){
            message = err;
            status = false;
        }
        return {status, message, user};
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
        console.log('Username:', username)
        const options = {
            scope: 'sub',
            // attributes: ['uid', 'dn', 'cn', 'mail'],
            filter: `(mail=${username})`
        };
        return new Promise((resolve, reject)=> {
            let found = false;
            this.client.search('DC=metaljunction,DC=com', options, (err, res) => {           
            
                res.on('searchEntry', entry => {
                    found = true;
                    resolve(JSON.stringify(entry.pojo, null, 2));
                });
                res.on('searchReference', referral => {
                    // console.log('referral: ' + referral.uris.join());
                });
                res.on('error', err => {
                    reject(err.message);
                });
                res.on('end', result => {
                    if (!found) {
                        reject('No record found');
                    }
                });
                
            });

        });
        
    }

}