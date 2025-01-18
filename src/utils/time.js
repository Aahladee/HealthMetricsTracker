
export const getTimeOfDay = (dateStr) => {
    console.log("hiiiiiii");
    const hour = new Date(dateStr).getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    return "evening";
  };
  
  export const isWithinLast24Hours = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
    return date >= twentyFourHoursAgo && date <= now;
  };
  