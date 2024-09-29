"use client";

import { message as AntdMessage } from "antd";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { redirect } from "next/navigation";

interface AxiosInstanceType extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T>;
}

export const CreateAxiosInstance = (
  config?: AxiosRequestConfig
): AxiosInstanceType => {
  const instance = axios.create({
    timeout: 5000,
    withCredentials: true,
    ...config,
  });

  instance.interceptors.request.use(
    function (config: any) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      config.headers = {
        userToken: user?._id,
      };
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    function (response) {
      const { status, data, message } = response as any;
      console.log("🚀 ~ status:", status)
      if (status === 200) {
        return data;
      } else if (status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        // return redirect("/login");
      } else if (status === 501) {
        window.location.href = "/dashboard";
      } else {
        AntdMessage.error(message);
        return Promise.reject(response.data);
      }
    },
    function (error) {
      if (error.response) {
        if (error.response.status === 401) {
          localStorage.removeItem("user");
          window.location.href = "/login";
        } else if (error.response.status === 501) {
          window.location.href = "/dashboard";
        }
      }
      AntdMessage.error(error?.response?.data?.message || "The server happens errors");
      return Promise.reject(error);
    }
  );

  return instance;
};

const request = CreateAxiosInstance({});
export default request;
