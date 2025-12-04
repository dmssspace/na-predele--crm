export const humanizeBlogCategoryTitle = (title: string) => {
    if (title === "article") {
      return "Статьи";
    }

    if (title === "announcement") {
      return "Объявления";
    }

    if (title === "video-report") {
      return "Видеоотчет";
    }

    if (title === "photo-report") {
      return "Фотоотчет"
    }

    return "-";
  }