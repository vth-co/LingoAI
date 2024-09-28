import React from 'react';
import { Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";
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
    const theme = useTheme()

    return (
        <div className="scroll-wrapper">
            <div className="scroll-container">
                {items.map((item, index) => (
                    <Typography
                        key={index}
                        className="scroll-item"
                        variant="h3"
                        sx={{
                            fontWeight: "400",
                            paddingLeft: "60px",
                        }}
                    >
                        {item}
                    </Typography>
                ))}
                {items.map((item, index) => (
                    <Typography
                        key={`repeat-${index}`}
                        className="scroll-item"
                        variant="h3"
                        sx={{
                            fontWeight: "400",
                            paddingLeft: "60px",
                        }}
                    >
                        {item}
                    </Typography>
                ))}
                {items.map((item, index) => (
                    <Typography
                        key={`repeat-${index + items.length}`}
                        className="scroll-item"
                        variant="h3"
                        sx={{
                            fontWeight: "400",
                            paddingLeft: "60px",
                        }}
                    >
                        {item}
                    </Typography>
                ))}
                {items.map((item, index) => (
                    <Typography
                        key={`repeat-${index + 2 * items.length}`}
                        className="scroll-item"
                        variant="h3"
                        sx={{
                            fontWeight: "400",
                            paddingLeft: "60px",
                        }}
                    >
                        {item}
                    </Typography>
                ))}
            </div>
            <div className="scroll-mask"></div>
        </div>
    );
};

export default InfiniteLangScroll;
