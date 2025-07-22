import { DoctorInfo } from '../types/doctor/doctor';

const sortBySpecializationMatch = (d: DoctorInfo[], sV: string) => {
  const lowerSearch = sV.toLowerCase();

  return d.slice().sort((a, b) => {
    // Проверяем, есть ли совпадение в массиве специализаций
    const aMatches = a.specialization.some((spec) =>
      spec.name.toLowerCase().includes(lowerSearch)
    );
    const bMatches = b.specialization.some((spec) =>
      spec.name.toLowerCase().includes(lowerSearch)
    );

    if (aMatches && !bMatches) return -1; // a раньше b
    if (!aMatches && bMatches) return 1; // b раньше a

    // Если оба совпадают или оба нет — сортируем по алфавиту по имени специализации
    const aSpecNames = a.specialization
      .map((spec) => spec.name.toLowerCase())
      .sort();
    const bSpecNames = b.specialization
      .map((spec) => spec.name.toLowerCase())
      .sort();

    // Сравниваем первые имена специализаций после сортировки
    return aSpecNames[0].localeCompare(bSpecNames[0]);
  });
};

export default sortBySpecializationMatch;
