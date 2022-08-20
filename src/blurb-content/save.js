import classnames from 'classnames';
import { useBlockProps, InnerBlocks, __experimentalGetColorClassesAndStyles as getColorClassesAndStyles } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function save({attributes}) {
	const {imageId, imageUrl, alt, width, height, imageAlign, imageHasEffect, maxWidth} = attributes;
 
    const blockProps = useBlockProps.save({
        className: classnames( 'jc-blurb-content', {[ `has-text-align-${ imageAlign }` ]: imageAlign}, getColorClassesAndStyles( attributes ).className),
        style: {maxWidth: maxWidth}
    });

	return (
		<div {...blockProps}>
            <div className={`jc-blurb-image${imageHasEffect ? ' jc-effect' : ''}`}>
                { imageUrl && <img width={width} height={height} src={imageUrl} alt={alt} className={ imageId ? `wp-image-${ imageId }` : '' } /> }
            </div>
            <div className="jc-blurb-info">
                <InnerBlocks.Content/>
            </div>		
		</div>
	);
}