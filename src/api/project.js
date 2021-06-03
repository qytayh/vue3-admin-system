
import instance from "./request";
const apiBase = "project/";

export const projectList = (data) => {
  return instance({
    url: apiBase + "projectList",
    method: "POST",
    data,
  });
};

export const projectAdd = (data) => {
  return instance({
    url: apiBase + "project",
    method: "POST",
    data,
  });
};

export const projectDel = (data) => {
  return instance({
    url: apiBase + "project/" + data.id,
    method: "DELETE",
  });
};

export const projectGet = (data) => {
  return instance({
    url: apiBase + "project/" + data.id,
    method: "GET",
  });
};

export const projectEdit = (data) => {
  return instance({
    url: apiBase + "project",
    method: "PUT",
    data,
  });
};

export const contentDel = (data) => {
  return instance({
    url: apiBase + "content/" + data.id,
    method: "DELETE",
  });
};

export const contentEdit = (data) => {
  return instance({
    url: apiBase + "content",
    method: "PUT",
    data,
  });
};
export const contentAdd = (data) => {
  return instance({
    url: apiBase + "content",
    method: "POST",
    data,
  });
};

export const contractorList = (data) => {
  return instance({
    url: apiBase + "contractor",
    method: "GET",
    data,
  });
}

export const contentList = (data) => {
  return instance({
    url: apiBase + "content/"+data.name,
    method: "GET",
    data,
  });
}

export default {
  projectList,
  projectAdd,
  projectDel,
  projectEdit,
  projectGet,
  contentDel,
  contentEdit,
  contentAdd,
  contractorList,
  contentList
};
