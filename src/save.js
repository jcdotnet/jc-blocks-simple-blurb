import classnames from 'classnames';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function save({attributes}) {
	const {imageId, imageUrl, alt, width, height, title, description, contentAlign, imageAlign} = attributes;

	return (
		<div {...useBlockProps.save()}>
			<div className={classnames( 'jc-blurb-content', {[ `has-content-align-${ contentAlign }` ]: contentAlign}, {[ `has-text-align-${ imageAlign }` ]: imageAlign})}>
				<div className="jc-blurb-image">
					{ imageUrl && <img width={width} height={height} src={imageUrl} alt={alt} className={ imageId ? `wp-image-${ imageId }` : '' } /> }
				</div>
				<div className="jc-blurb-info">
					<RichText.Content className="jc-blurb-title" tagName="h4" value={title} />
					<div className="jc-blurb-description">
						<RichText.Content tagName="p" value={description} />
					</div>
				</div>
			</div>
		</div>
	);
}
