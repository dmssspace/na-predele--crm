"use client";

import {
  type CrudFilters,
  type CrudOperators,
  type CrudSorting,
  type HttpError,
  type Pagination,
  type DataProvider,
} from "@refinedev/core";
import axios, { type AxiosInstance } from "axios";
import { stringify } from "querystring";
import { API_URL } from "@providers/constants";

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";

const fetcher = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

fetcher.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.error?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  }
);

const dp = (
  apiURL: string,
  httpClient: AxiosInstance = fetcher
): DataProvider => ({
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const url = `${apiURL}/${resource}`;
    const { headers: headersFromMeta, method } = meta ?? {};
    const reqMethod = (method as MethodTypes) ?? "get";
    const query: {
      page?: number;
      limit?: number;
      _sort?: string;
      _order?: string;
    } = {};

    const generatedPagination = generatePagination(pagination);

    if (generatedPagination) {
      const { page, limit } = generatedPagination;

      query.page = page;
      query.limit = limit;
    }

    const generatedSort = generateSort(sorters);

    if (generatedSort) {
      const { _sort, _order } = generatedSort;

      query._sort = _sort.join(",");
      query._order = _order.join(",");
    }

    const generatedFilters = generateFilters(filters);

    const { data, headers } = await httpClient[reqMethod](
      `${url}?${stringify(query)}&${stringify(generatedFilters)}`,
      {
        headers: headersFromMeta,
      }
    );

    return {
      data: data.data,
      total: data.pagination.total || data.length,
    };
  },
  getOne: async ({ resource, id, meta }) => {
    const url = `${apiURL}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const reqMethod = (method as MethodTypes) ?? "get";

    const { data } = await httpClient[reqMethod](url, {
      headers,
    });

    return {
      data: data.data,
    };
  },
  create: async ({ resource, variables, meta }) => {
    const url = `${apiURL}/${resource}`;
    const { headers, method, isFormData } = meta ?? {};
    const reqMethod = (method as MethodTypesWithBody) ?? "post";

    let requestConfig: any = { headers };

    if (isFormData && variables instanceof FormData) {
      requestConfig.headers = {
        ...headers,
        "Content-Type": "multipart/form-data",
      };
    }

    const { data } = await httpClient[reqMethod](url, variables, requestConfig);

    return {
      data: data.data,
    };
  },
  update: async ({ resource, id, variables, meta }) => {
    const url = `${apiURL}/${resource}/${id}`;

    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "put";

    const { data } = await httpClient[requestMethod](url, variables, {
      headers,
    });

    return {
      data,
    };
  },
  deleteOne: async ({ resource, id, variables, meta }) => {
    const url = `${apiURL}/${resource}/${id}`;
    const { headers, method } = meta ?? {};
    const requestMethod = (method as MethodTypesWithBody) ?? "delete";

    const { data } = await httpClient[requestMethod](url, {
      data: variables,
      headers,
    });

    return {
      data: data.data,
    };
  },
  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
  }) => {
    let requestUrl = `${apiURL}/${url}`;

    if (sorters) {
      const generatedSort = generateSort(sorters);
      if (generatedSort) {
        const { _sort, _order } = generatedSort;
        const sortQuery = {
          _sort: _sort.join(","),
          _order: _order.join(","),
        };
        requestUrl = `${requestUrl}?${stringify(sortQuery)}`;
      }
    }

    if (filters) {
      const generatedFilters = generateFilters(filters);
      requestUrl = `${requestUrl}${
        requestUrl.includes("?") ? "&" : "?"
      }${stringify(generatedFilters)}`;
    }

    if (query) {
      requestUrl = `${requestUrl}${
        requestUrl.includes("?") ? "&" : "?"
      }${stringify(query)}`;
    }

    let axiosResponse;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        axiosResponse = await httpClient[method](requestUrl, payload, {
          headers,
        });
        break;
      case "delete":
        axiosResponse = await httpClient.delete(requestUrl, {
          data: payload,
          headers,
        });
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl, {
          headers,
        });
        break;
    }

    const { data } = axiosResponse;

    return Promise.resolve({ data });
  },
  getApiUrl: () => apiURL,
});

const mapOperator = (operator: CrudOperators): string => {
  switch (operator) {
    case "ne":
    case "gte":
    case "lte":
      return `_${operator}`;
    case "contains":
      return "_like";
    case "eq":
    default:
      return "";
  }
};

const generateFilters = (filters?: CrudFilters) => {
  const queryFilters: { [key: string]: string } = {};

  if (filters) {
    filters.map((filter) => {
      if (filter.operator === "or" || filter.operator === "and") {
        throw new Error(
          `[@refinedev/simple-rest]: /docs/data/data-provider#creating-a-data-provider`
        );
      }

      if ("field" in filter) {
        const { field, operator, value } = filter;

        if (field === "q") {
          queryFilters[field] = value;
          return;
        }

        const mappedOperator = mapOperator(operator);
        queryFilters[`${field}${mappedOperator}`] = value;
      }
    });
  }

  return queryFilters;
};

const generateSort = (sorters?: CrudSorting) => {
  if (sorters && sorters.length > 0) {
    const _sort: string[] = [];
    const _order: string[] = [];

    sorters.map((item) => {
      _sort.push(item.field);
      _order.push(item.order);
    });

    return {
      _sort,
      _order,
    };
  }

  return;
};

const generatePagination = (pagination?: Pagination) => {
  const { currentPage = 1, pageSize = 10, mode = "server" } = pagination ?? {};

  const query: {
    page?: number;
    limit?: number;
  } = {};

  if (mode === "server") {
    query.page = currentPage;
    query.limit = pageSize;
  }

  return query;
};

export const dataProvider = dp(API_URL);
