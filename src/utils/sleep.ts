async function sleep(duration: number) {
  return new Promise(res => setTimeout(res, duration));
}
