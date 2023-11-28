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
            fields: `fields=${sourceObject.fields.join(',').replaceAll("?", "")}`
          };
        case 2:
        case 3:
          return {
            auth: prod_id_details_Map[currentObject.product].auth,
            domain: prod_id_details_Map[currentObject.product].domain,
            apiPath: prod_id_details_Map[currentObject.product].apiPath,
            object: currentObject.code,
            query: `q=${currentObject.linkTo}=${sourceEntry[currentObject.linkWith.split('~')[1] ? currentObject.linkWith.split('~')[1] : currentObject.linkWith.split('~')[0]]}`,
            fields: `fields=${currentObject.fields.join(',').replaceAll("?", "")}`
          };
      }
      break;

    case "OSVC":
      switch(type) {
        case 1:
          return {
            auth: prod_id_details_Map[sourceObject.product].auth,
            domain: prod_id_details_Map[sourceObject.product].domain,
            apiPath: prod_id_details_Map[sourceObject.product].apiPath,
            object: sourceObject.code,
            query: `q=${sourceObject.uiSearchParam}=${uiSearchParam}`,
            fields: `fields=${sourceObject.fields.join(',').replaceAll("?", "")}`
          };
        case 2:
          break;
        case 3:
          break;
      }
      break;

    default:
      break;
  }

  return {};
}

module.exports = { quickSortAsync, generateFindParams };
