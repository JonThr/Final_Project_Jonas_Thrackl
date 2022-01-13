import { inject, injectable } from 'inversify';
import { LoggerService } from './logger.service';
import { Connection, r, RConnectionOptions, RDatum } from 'rethinkdb-ts';
import * as databaseConfiguration from '../../configuration/database-config.json';
import { UserEntry } from '../../models/userEntry.model';
import { AdminEntry } from '../../models/adminEntry.model';
import { Params } from '@angular/router';
import { TrackingEntry } from '../../models/trackingEntry.model';
import { TrackingEntriesController } from '../../api/events/tracking-entries.controller';

@injectable()
export class DatabaseService {
  constructor(
    @inject(LoggerService.name) private loggerService: LoggerService
  ) {}

  public async initialize(): Promise<boolean> {
    const connection = await this.connect();
    r.dbList()
      .contains(databaseConfiguration.databaseName)
      .do((containsDatabase: RDatum<boolean>) => {
        return r.branch(
          containsDatabase,
          { created: 0 },
          r.dbCreate(databaseConfiguration.databaseName)
        );
      })
      .run(connection)
      .then(() => {
        this.loggerService.info('Trying to create tables');
        this.createTables(connection)
          .then(() => {
            this.loggerService.info('Tables created');
            return Promise.resolve(true);
          })
          .catch((error) => {
            this.loggerService.error(error);
            return Promise.reject(false);
          });
      });
      return Promise.resolve(true);
  }

  public getAllAdmins(): Promise<Array<AdminEntry>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('adminEntries')
          .filter({})
          .run(connection)
          .then((response: Array<AdminEntry>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving admin entries');
          });
      });
    });
  }

  public addNewAdmin(user: AdminEntry): Promise<boolean> {
    return new Promise((resolve, reject) => {
        this.connect().then((connection: Connection) => {
            this.loggerService.info('Trying to add admin.');
            r.db(databaseConfiguration.databaseName)
                .table('adminEntries')
                .insert({
                    "email": user.email,
                    "password": user.password
                    })
                .run(connection)
                .then(() => { 
                    this.loggerService.info('admin added to table.'); 
                    resolve(true);
                })
                .catch((error) => {
                    this.loggerService.error(error, 'Error while adding admin.');
                    reject(false);
                });
        })
    })
}

  public getAllEntries(): Promise<Array<UserEntry>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('userEntries')
          .filter({})
          .run(connection)
          .then((response: Array<UserEntry>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving entries');
          });
      });
    });
  }

  public deleteAllEntries(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('userEntries')
          .delete()
          .run(connection)
          .then(() => {
            resolve(true);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while delete entries');
            reject(false);
          });
      });
    });
  }

  public addNewEntry(entry: UserEntry): Promise<boolean> {
    return new Promise((resolve, reject) => {
        this.connect().then((connection: Connection) => {
            this.loggerService.info('Trying to add entry.');
            r.db(databaseConfiguration.databaseName)
                .table('userEntries')
                .insert({
                    "id": entry.id,
                    "qrcode": entry.qrCode,
                    "firstname": entry.firstname,
                    "lastname": entry.lastname,
                    "company": entry.company,
                    "address": entry.address,
                    "city": entry.city,
                    "state": entry.state,
                    "postalCode": entry.postalCode,
                })
                .run(connection)
                .then(() => { 
                    this.loggerService.info('entry entry got added to table.'); 
                    resolve(true);
                })
                .catch((error) => {
                    this.loggerService.error(error, 'Error while adding entry.');
                    reject(false);
                });
        })
    })
}

public deleteEntry(params: Params): Promise<boolean> {
  return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
          this.loggerService.info('Trying to delete user entry.');
          r.db(databaseConfiguration.databaseName)
              .table('userEntries')
              .get(params["id"])
              .delete()
              .run(connection)
              .then(() => { 
                  this.loggerService.info('admin entry got deleted in table.'); 
                  resolve(true);
              })
              .catch((error) => {
                  this.loggerService.error(error, 'Error while deleting admin entry.');
                  reject(false);
              });
      })
  })
}

public getAllTrackingEntries(): Promise<Array<TrackingEntry>> {
  return new Promise((resolve, reject) => {
    this.connect().then((connection: Connection) => {
      r.db(databaseConfiguration.databaseName)
        .table('trackingEntries')
        .filter({})
        .run(connection)
        .then((response: Array<TrackingEntry>) => {
          resolve(response);
        })
        .catch((error) => {
          this.loggerService.error(error, 'Error while retrieving tracking entries');
        });
    });
  });
}

public checkIn(entry: TrackingEntry): Promise<boolean> {
  return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
          this.loggerService.info('Trying to add tracking entry.');
          r.db(databaseConfiguration.databaseName)
              .table('trackingEntries')
              .insert({
                  "id": entry.id,
                  "checkOutId": '',
                  "name": entry.name,
                  "checkIn": new Date().toLocaleString(),
                  "checkOut": ''
              })
              .run(connection)
              .then(() => { 
                  this.loggerService.info('tracking entry got added to table.'); 
                  resolve(true);
              })
              .catch((error) => {
                  this.loggerService.error(error, 'Error while adding tracking entry.');
                  reject(false);
              });
      })
  })
}

  // public UpdateEntry(userEntry: UserEntry): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     this.connect().then((connection: Connection) => {
  //       r.db(databaseConfiguration.databaseName)
  //         .table('userEntries')
  //         .update(userEntry)
  //         .run(connection)
  //         .then(() => {
  //           resolve(true);
  //         })
  //         .catch((error) => {
  //           this.loggerService.error(error, 'Error while retrieving entries');
  //           reject(false);
  //         });
  //     });
  //   });
  // }

// r.db("contactTracing").table("userEntries")

// r.db("contactTracing").table("userEntries").insert({
//   "qrCode": "www.google.at",
//   "firstname": "The",
//  "lastname": "Wock",
//  "company": "muster gmbh",
//    "address": "test",
//    "city": "test",
//    "state": "test",
// })

  // public AddEntry(entry: UserEntry): void{
  //   this.connect().then((connection: Connection) => {
  //     r.db(databaseConfiguration.databaseName)
  //     .table('userEntries')
  //     .insert([entry.id, entry.qrCode, entry.firstname, entry.lastname, entry.company, entry.address, entry.city, entry.state, entry.postalCode])
  //     .run(connection, function(err, result){
  //       if(err) throw err;
  //       this.loggerService.error(err, 'Error while adding entry');
  //     })
  //   })
  // }

  'MINUTE 41:32 --> 11 26'

  private createTables(connection: Connection): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const promises = new Array<Promise<boolean>>();
      databaseConfiguration.databaseTables.forEach((table) => {
        promises.push(this.createTable(connection, table));
      });
      Promise.all(promises)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          this.loggerService.error(error);
          reject(false);
        });
    });
  }

  private createTable(
    connection: Connection,
    tableName: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      r.db(databaseConfiguration.databaseName)
        .tableList()
        .contains(tableName)
        .do((containsTable: RDatum<boolean>) => {
          return r.branch(
            containsTable,
            { create: 0 },
            r.db(databaseConfiguration.databaseName).tableCreate(tableName, {primaryKey: 'id'})
          );
        })
        .run(connection)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          this.loggerService.error(error);
          reject(false);
        });
    });
  }

  private connect(): Promise<Connection> {
    const rethinkDbOptions: RConnectionOptions = {
      host: databaseConfiguration.databaseServer,
      port: databaseConfiguration.databasePort,
    };
    return new Promise((resolve, reject) => {
      r.connect(rethinkDbOptions)
        .then((connection: Connection) => {
          resolve(connection);
        })
        .catch(reject);
    });
  }
}
