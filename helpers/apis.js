const axios = require("axios");

function OEC_contacts_list(domain, auth, limit, fields) {
    limit = limit ? limit : "limit=25";
    fields = fields ? fields : "fields=PartyId,PartyNumber,FirstName,LastName,MiddleName,MobileCountryCode,MobileNumber";

    let config = {
        method: 'get',
        url: `${domain}/crmRestApi/resources/11.13.18.05/contacts?orderBy=LastUpdateDate:desc&${limit}&${fields}`,
        headers: { 'REST-Framework-Version': '2', 'Authorization': auth }
    };

    return axios(config);
}

function OEC_contacts_find(domain, auth, query, limit, fields) {
    limit = limit ? limit : "limit=25";
    fields = fields ? fields : "fields=PartyId,PartyNumber,FirstName,LastName,MiddleName,MobileCountryCode,MobileNumber";
    const orderBy = "orderBy=LastUpdateDate:desc";

    let config = {
        method: 'get',
        url: `${domain}/crmRestApi/resources/11.13.18.05/contacts?${orderBy}&${limit}&${fields}&${query}`,
        headers: { 'REST-Framework-Version': '2', 'Authorization': auth }
    };

    return axios(config);
}

function OSVC_contacts_list(domain, auth, limit = null, fields) {
    const srcObject = "contacts", orderBy = `order by updatedTime desc`;
    const query = `query=SELECT ${fields.split('fields=')[1]} FROM ${srcObject}`;
    limit = `${limit.split("=")[0]} ${limit.split("=")[1]}`
    const url = `${domain}/services/rest/connect/v1.4/queryResults?${query} ${orderBy} ${limit}`;
    // console.log(url, " : OSVC_contacts_list - url");

    let config = {
        method: 'get',
        url,
        headers: {
            'REST-Framework-Version': '2',
            'Authorization': auth,
            'osvc-crest-application-context': 'CIC Data Ingest'
        }
    };

    return axios(config);
}

function OSVC_contacts_find(domain, auth, query, limit, fields) {
    const srcObject = "contacts", orderBy = `order by updatedTime desc`;
    limit = `${limit.split("=")[0]} ${limit.split("=")[1]}`;
    fields = `${fields.split('fields=')[1]}`;
    query = `query=SELECT ${fields} FROM ${srcObject} WHERE ${query.split("=")[1]}='${query.split("=")[2]}'`;
    const url = `${domain}/services/rest/connect/v1.4/queryResults?${query} ${orderBy} ${limit}`;
    console.log(url, " : OSVC_contacts_find - url");

    let config = {
        method: 'get',
        url,
        headers: {
            'REST-Framework-Version': '2',
            'Authorization': auth,
            'osvc-crest-application-context': 'CIC Data Ingest'
        }
    };

    return axios(config);
}

function GENERAL_find(auth, domain, apiPath, objCode, query, fields, headers = null) {
    const url = `${domain}${apiPath}${objCode}?${query}&${fields}`;
    headers = {
        'Authorization': auth,
        ...(headers !== null && Object.keys(headers).length && headers)
    };
    console.log(url, ":GENERAL_find -> url");

    let config = { method: 'get', url, headers };
    return axios(config);
}

module.exports = {
    OEC: {
        list_contacts: OEC_contacts_list,
        find_contacts: OEC_contacts_find
    },
    OSVC: {
        list_contacts: OSVC_contacts_list,
        find_contacts: OSVC_contacts_find
    },
    GENERAL: {
        find: GENERAL_find
    }
}