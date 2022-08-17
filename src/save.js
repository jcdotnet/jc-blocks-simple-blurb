import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({attributes}) {
	const {imageId, imageUrl, alt, width, height, title, content} = attributes;

	return (
		<div {...useBlockProps.save()}>
			<div className="jc-blurb-image">
				{ imageUrl && <img width={width} height={height} src={imageUrl} alt={alt} className={ imageId ? `wp-image-${ imageId }` : '' } /> }
			</div>
			<div className="jc-blurb-content">
				<RichText.Content tagName="h4" value={title} />
				<RichText.Content tagName="p" value={content} />
			</div>
		</div>
	);
}
