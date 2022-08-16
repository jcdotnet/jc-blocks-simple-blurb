import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({attributes}) {
	const {image_id, image_url, image_alt, width, height, title, content} = attributes;

	return (
		<div {...useBlockProps.save()}>
			<div className="jc-blurb-image">
				{ image_url && <img width={width} height={height} src={image_url} alt={image_alt} className={ image_id ? `wp-image-${ image_id }` : '' } /> }
			</div>
			<div className="jc-blurb-content">
				<RichText.Content tagName="h4" value={title} />
				<RichText.Content tagName="p" value={content} />
			</div>
		</div>
	);
}
