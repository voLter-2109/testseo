function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toDateString();
}

export default formatDate;
