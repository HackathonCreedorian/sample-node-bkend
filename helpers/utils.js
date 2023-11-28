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
function generateFindParams(type, uiSearchParam, currentObject, sourceObject, sourceProduct, prod_id_details_Map) {
  switch(prod_id_details_Map[currentObject.product].name) {
    case "OEC":
      console.log("OEC", " : 27112023 - generateFindParams -> OEC");
      break;

    case "OSVC":
      console.log("OSVC", " : 27112023 - generateFindParams -> OSVC");
      break;

    default:
      break;
  }
  return {};
}

module.exports = { quickSortAsync, generateFindParams };
