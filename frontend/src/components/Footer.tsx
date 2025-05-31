import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

function Footer() {
  return (
    <div className="bg-gray-800 text-white py-4 px-6 ">
      <div className="max-w-7xl mx-auto text-center">
        <Text className="text-gray-300">© 2025 國立高雄科技大學智慧商務研究所 | 論文研究：擬人化機器人性別設計與產品刻板印象對購買意圖的影響 </Text>
      </div>
    </div>
  );
};

export default Footer;