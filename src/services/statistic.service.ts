/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiConstant } from '@/constants/api.constant';
import axios from '@/services/axios';

export const getPriceStatistic = async () => {
  try {
    const { data: response } = await axios.get(ApiConstant.statistics.price);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getParkingStatistic = async () => {
  try {
    const { data: response } = await axios.get(ApiConstant.statistics.parking);

    const bikeParkingPrice = response.data.bikeParkingStats;
    const carParkingPrice = response.data.carParkingStats;

    const mergedParkingPrices = [
      ...new Set([
        ...bikeParkingPrice.map((item: { bikeParkingCategory: string }) => item.bikeParkingCategory),
        ...carParkingPrice.map((item: { carParkingCategory: string }) => item.carParkingCategory),
      ]),
    ].map((priceCategory) => {
      const bikeData = bikeParkingPrice.find(
        (item: { bikeParkingCategory: string }) => item.bikeParkingCategory === priceCategory,
      );
      const carData = carParkingPrice.find(
        (item: { carParkingCategory: string }) => item.carParkingCategory === priceCategory,
      );

      return {
        price: formatCategory(priceCategory),
        bike: bikeData?.projectCount || '0',
        car: carData?.projectCount || '0',
      };
    });

    return mergedParkingPrices;
  } catch (error) {
    console.error(error);
  }
};

export const getDistrictStatistic = async () => {
  try {
    const { data: response } = await axios.get(ApiConstant.statistics.district);
    return response.data.map((item: any, index: number) => ({
      ...item,
      fill: predefinedColor[index % predefinedColor.length],
    }));
  } catch (error) {
    console.error(error);
  }
};

export const getAreaStatistic = async () => {
  try {
    const { data: response } = await axios.get(ApiConstant.statistics.area);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const formatCategory = (category: string): string => {
  switch (category) {
    case 'No Fee':
      return '0';
    case '0 - 100,000 VND':
      return '0 - 100k';
    case '100,000 - 500,000 VND':
      return '100k - 500k';
    case '500,000 - 1 Million VND':
      return '500k - 1M';
    case '> 1 Million VND':
      return '> 1M';
    default:
      return category;
  }
};

const predefinedColor = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#FFC300',
  '#C70039',
  '#900C3F',
  '#581845',
  '#DAF7A6',
  '#FF8D1A',
  '#8D33FF',
  '#33FFF6',
  '#FFD700',
  '#FF1493',
  '#40E0D0',
  '#7FFF00',
  '#FF4500',
  '#00CED1',
  '#6495ED',
  '#FF6347',
];
