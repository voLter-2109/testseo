// import axios from 'axios';

// const SITE_URL = process.env.REACT_APP_API_URL_REST;
// const API_URL = `${SITE_URL}/doctors/list/`;
// // const OUTPUT_DIR = path.join(__dirname, '../build');

// module.exports = async () => {
//   try {
//     // 1. Убираем логи из кода
//     const {
//       data: { results },
//     } = await axios.get(API_URL, {
//       timeout: 10000,
//       headers: {
//         'X-React-Snap': 'true', // Пометить запрос
//       },
//     });
//     console.log('🚀 ~ module.exports= ~ results:', results);

//     //     // 2. Форматируем дату
//     //     const lastmod = new Date().toISOString().split('T')[0];

//     //     // 3. Генерируем корректные пути
//     //     const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
//     // <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//     //   ${results
//     //     .map(
//     //       (user) => `
//     //       <url>
//     //         <loc>${SITE_URL}/our-doctors/${user.id}</loc>
//     //         <lastmod>${lastmod}</lastmod>
//     //         <changefreq>monthly</changefreq>
//     //         <priority>0.7</priority>
//     //       </url>`
//     //     )
//     //     .join('')}
//     // </urlset>`;

//     //     // 4. Создаем директорию, если не существует
//     //     if (!fs.existsSync(OUTPUT_DIR)) {
//     //       fs.mkdirSync(OUTPUT_DIR, { recursive: true });
//     //     }

//     // 5. Сохраняем файл
//     // fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap);

//     return true;
//   } catch (error: any) {
//     console.error('❌ Sitemap error:', error.message);
//     return false;
//   }
// };

export const fetchDynamicRoutes = async () => {
  try {
    const response = await fetch(
      'https://api.dev.chat.doct24.com/api/v1/doctors/list/'
    );
    console.log(response);
    // @ts-ignore
    return response.results.map((doctor: any) => {
      console.log('🚀 ~ returndoctors.map ~ doctor:', doctor);

      return doctor;
    });
  } catch (error) {
    console.error('Ошибка получения данных:', error);
    return [];
  }
};

module.exports = async () => {
  fetchDynamicRoutes();
};


    // "postbuild": "react-snap",
    // "presnap": "node src/utils/generateSitemap.ts",