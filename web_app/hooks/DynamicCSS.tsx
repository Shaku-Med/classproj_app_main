'use client'

interface DynamicCSSProps {
    cssFile?: string
}

export default function DynamicCSS({ cssFile }: DynamicCSSProps) {
    try {
        if (cssFile && cssFile !== ``) {
            import(`@/app/styles/${cssFile}`).catch((e) => {
                console.error(`Failed to load CSS file: ${cssFile}`, e);
            });
        }
        return null;
    } catch (error) {
        console.error('Error in DynamicCSS:', error);
        return null;
    }
}