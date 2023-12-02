const epsilon = 0.0001;

async function quickSortAsync(arr, prop, order) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[0][prop];
  const left = [];
  const right = [];

  for (let i = 1; i < arr.length; i++) {
    if ((order === "asc" && arr[i][prop] - pivot < epsilon) || (order === "desc" && pivot - arr[i][prop] < epsilon)) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  const sortedLeft = await quickSortAsync(left, prop, order);
  const sortedRight = await quickSortAsync(right, prop, order);

  return [...sortedRight, arr[0], ...sortedLeft];
}

/*
  type - 
    1 (source object), 
    2 (source product object), 
    3 (other product objects)
  uiSearchParam - the search text with which we are uniquely identifying customers across products
  currentObject - object for which we are generating params
  sourceObject - object which we are using as customer entry point
  sourceProduct - product which contains the sourceObject
  prod_id_details_map - object structure designed to provide a mapping between the product id and the rest of the details
*/
function generateFindParams(type, uiSearchParam, currentObject, sourceEntry, sourceObject, sourceProduct, prod_id_details_Map) {
  let object, fields;

  switch(prod_id_details_Map[currentObject.product].name) {
    case "SCM":
    case "OEC":
      switch(type) {
        case 1:
          return {
            auth: prod_id_details_Map[sourceObject.product].auth,
            domain: prod_id_details_Map[sourceObject.product].domain,
            apiPath: prod_id_details_Map[sourceObject.product].apiPath,
            object: sourceObject.code,
            query: `q=${sourceObject.uiSearchParam}=${uiSearchParam}`,
            fields: `fields=${sourceObject.fields.join(',').replaceAll("?", "")}`,
            headers: null
          };
        case 2:
        case 3:
          // console.log({ type, uiSearchParam, currentObject, sourceEntry, sourceObject }, " : generateFindParams - parameters");
          return {
            auth: prod_id_details_Map[currentObject.product].auth,
            domain: prod_id_details_Map[currentObject.product].domain,
            apiPath: prod_id_details_Map[currentObject.product].apiPath,
            object: currentObject.code,
            query: `q=${currentObject.linkTo}=${sourceEntry[0][currentObject.linkWith.includes('~') ? currentObject.linkWith.split('~')[1] : currentObject.linkWith]}`,
            fields: `fields=${currentObject.fields.join(',').replaceAll("?", "")}`,
            headers: null
          };
      }
      break;

    case "OSVC":
      switch(type) {
        case 1:
          /*
            "query=SELECT "
            id,emails.address,name.first,Phones.number
            " FROM "
            contacts
            " WHERE "
            emails.address
            "='"
            nisha.biju@speridian.com.invalid
            "'"
          */          
          fields = `${currentObject.fields.join(',').replaceAll("?", "")}`;
          object = sourceObject.code;
          return {
            auth: prod_id_details_Map[sourceObject.product].auth,
            domain: prod_id_details_Map[sourceObject.product].domain,
            apiPath: prod_id_details_Map[sourceObject.product].apiPath,
            object: "",
            query: `query=SELECT ${fields} FROM ${object} WHERE ${sourceObject.uiSearchParam}='${uiSearchParam}';`,
            fields: "",
            headers: { 'osvc-crest-application-context': 'CIC Data Ingest' }
          };
        case 2:
        case 3:
          // console.log({ type, uiSearchParam, currentObject, sourceEntry, sourceObject }, " : generateFindParams - parameters");
          fields = `${currentObject.fields.join(',').replaceAll("?", "")}`;
          object = currentObject.code;
          return {
            auth: prod_id_details_Map[sourceObject.product].auth,
            domain: prod_id_details_Map[sourceObject.product].domain,
            apiPath: prod_id_details_Map[sourceObject.product].apiPath,
            object: "",
            query: `query=SELECT ${fields} FROM ${object} WHERE ${currentObject.linkTo}=${sourceEntry[0][currentObject.linkWith.includes('~') ? currentObject.linkWith.split('~')[1] : currentObject.linkWith]};`,
            fields: "",
            headers: { 'osvc-crest-application-context': 'CIC Data Ingest' }
          };
      }
      break;

    default:
      break;
  }
}

function formatResponseSearch(records, fields, qField, srcObject) {
  switch(srcObject) {
    case "OEC":
      return { records, fields, qField, srcObject };
    case "OSVC":
      const result = records[0].rows.map(row => {
        const obj = {};
        fields.forEach((key, index) => {
          obj[key] = row[index];
        });
        return obj;
      });
      return { records: result, fields, qField, srcObject };
  }

}

function formatResponseDetails(sourceProduct, srcObjResp, fields = null) {
  console.log({ sourceProduct, srcObjResp: srcObjResp.data.items, fields }, " : formatResponseDetails - details");

  switch(sourceProduct.name) {
    case "SCM":
    case "OEC":
      const temp = srcObjResp.data.items.map(item => {
        const tempItem = { ...item };
        delete tempItem.links;
        return tempItem;
      });
      // console.log(temp, " : 02122023 - temp");

      return temp;
      // return srcObjResp.data.items;
    case "OSVC":
      const result = srcObjResp.data.items[0].rows.map(row => {
        const obj = {};
        fields.forEach((key, index) => {
          obj[key] = row[index];
        });
        return obj;
      });
      // console.log(result, " : result");
      return result;
  }
}

module.exports = { quickSortAsync, generateFindParams, formatResponseSearch, formatResponseDetails };
