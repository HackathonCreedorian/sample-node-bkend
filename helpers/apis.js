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

function GENERAL_find(auth, domain, apiPath, objCode, query, fields) {
    const url = `${domain}${apiPath}${objCode}?${query}&${fields}`;
    console.log(url, ":GENERAL_find -> url");

    let config = { method: 'get', url, headers: { 'Authorization': auth } }

    return axios(config);
}

module.exports = {
    OEC: {
        list_contacts: OEC_contacts_list,
        find_contacts: OEC_contacts_find
    },
    GENERAL: {
        find: GENERAL_find
    }
}