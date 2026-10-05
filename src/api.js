import { COURSES } from "./data.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchCourses() {
  await wait(600);
  if (window.location.hash.includes("fail")) {
    throw new Error("Could not reach the course server.");
  }
  return COURSES;
}