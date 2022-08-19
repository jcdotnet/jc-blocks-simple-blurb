import classnames from 'classnames';
import { useBlockProps, InnerBlocks, __experimentalGetColorClassesAndStyles as getColorClassesAndStyles } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function save({attributes}) {
	const {imageId, imageUrl, alt, width, height, contentAlign, imageAlign} = attributes;

	return (
		<div {...useBlockProps.save()}>
			<div className={classnames( 'jc-blurb-content', {[ `has-content-align-${ contentAlign }` ]: contentAlign}, {[ `has-text-align-${ imageAlign }` ]: imageAlign}, getColorClassesAndStyles( attributes ).className)}>
				<div className="jc-blurb-image">
					{ imageUrl && <img width={width} height={height} src={imageUrl} alt={alt} className={ imageId ? `wp-image-${ imageId }` : '' } /> }
				</div>
				<div className="jc-blurb-info">
					<InnerBlocks.Content/>
				</div>
			</div>
		</div>
	);
}
