import React from 'react';
import "../styles/styles.css";

const InfiniteLangScroll = () => {
    const items = [
        'Sélectionnez Votre Langue',
        '언어를 선택하세요',
        'Seleccione Su Idioma',
        '言語を選択してください.',
        'Chọn Ngôn Ngữ Của Bạn',
        '选择您的语言',
        'اپنی زبان منتخب کریں۔',
    ];

    return (
        <div className="scroll-wrapper">
            <div className="scroll-container">
                {items.map((item, index) => (
                    <p key={index} className="scroll-item">
                        {item}
                    </p>
                ))}
                {/* Repeat the list to make the scroll effect more seamless */}
                {items.map((item, index) => (
                    <p key={`repeat-${index}`} className="scroll-item">
                        {item}
                    </p>
                ))}
                {items.map((item, index) => (
                    <p key={`repeat-${index + items.length}`} className="scroll-item">
                        {item}
                    </p>
                ))}
                {items.map((item, index) => (
                    <p key={`repeat-${index + 2 * items.length}`} className="scroll-item">
                        {item}
                    </p>
                ))}
            </div>
            <div className="scroll-mask"></div>
        </div>
    );
};

export default InfiniteLangScroll;
