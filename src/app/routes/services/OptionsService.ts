/// <reference path="../../../../typings/tsd.d.ts" />

import Q = require('q');

import DbManager = require('../../../database/DbManager');

export function getPrevious(dateTime: Date): Q.Promise<[{ dateTime: Date }]> {
    return Q.ninvoke<[{ dateTime: Date }]>(
        DbManager.db.collection('options'), 'aggregate', [
            { $match: { 'quote.dateTime': { $lt: dateTime }}},
            { $sort: { 'quote.dateTime': -1}},
            { $limit: 1 },
            { $project: { _id: 0, dateTime: '$quote.dateTime' }}
        ]
    );
}

export function getNext(dateTime: Date): Q.Promise<[{ dateTime: Date }]> {
    return Q.ninvoke<[{ dateTime: Date }]>(
        DbManager.db.collection('options'), 'aggregate', [
            { $match: { 'quote.dateTime': { $gt: dateTime }}},
            { $sort: { 'quote.dateTime': 1}},
            { $limit: 1 },
            { $project: { _id: 0, dateTime: '$quote.dateTime' }}
        ]
    );
}