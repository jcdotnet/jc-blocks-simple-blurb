/**
 * External dependencies
 */
import classnames from 'classnames';

 /**
 * WordPress dependencies
 */
import { isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { 
	InnerBlocks,
	AlignmentControl,
	useBlockProps,
	MediaPlaceholder, 
	BlockIcon, 
	BlockControls, 
	MediaReplaceFlow, 
	InspectorControls,
	__experimentalImageSizeControl as ImageSizeControl,
	__experimentalLinkControl as LinkControl,
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';
import { 
	Spinner, 
	withNotices, 
	ToolbarButton, 
	Popover, 
	PanelBody, 
	TextareaControl, 
	ExternalLink, 
	ToggleControl, 
	TextControl,
	__experimentalUnitControl as UnitControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { link as linkIcon, linkOff, image as icon } from '@wordpress/icons';

/**
 * Is the URL a temporary blob URL? A blob URL is one that is used temporarily
 * while the image is being uploaded and will not have an id yet allocated.
 *
 * @param {number=} id  The id of the image.
 * @param {string=} url The url of the image.
 *
 * @return {boolean} Is the URL a Blob URL
 */
const isTemporaryImage = ( id, url ) => ! id && isBlobURL( url );

function Edit( { attributes, setAttributes, isSelected, noticeOperations, noticeUI } ) { // we get the noticeOperations and the noticeUI props from the withNotices higher-order component

    const {imageId, imageUrl, alt, link, linkTarget, linkRel, width, height, imageAlign, imageHasEffect, maxWidth, allowBlocks } = attributes;

    // BLURB content (main element)
    const classes = classnames( 'jc-blurb-content', {
        [ `has-text-align-${ imageAlign }` ]: imageAlign }, 
        useColorProps( attributes ).className
	);
    const blockProps = useBlockProps( {
		className: classes,
		style: { ...useColorProps( attributes ).style, ...{maxWidth}}
	} );

    const widthUnits = [
        { value: 'px', label: 'px', default: 550 },
        { value: '%', label: '%', default: 0 },
        { value: 'em', label: 'em', default: 0 },
		{ value: 'vw', label: 'em', default: 0 },
    ];

	function onAllowBlocksChange() {
		setAttributes( { allowBlocks: ! allowBlocks } );
	}

    // BLURB image (source)
    const [ temporaryURL, setTemporaryURL ] = useState();

	const image = useSelect((select) => {
		const { getMedia } = select( 'core' );
		return imageId ? getMedia(imageId) : null;
	}, [imageId]);

	const imageRef = useRef();
	
	const onAltChange = (alt) => {
		setAttributes({alt: alt})
	}

	const onImageHasEffectChange = () => {
		setAttributes( { imageHasEffect: ! imageHasEffect } );
	}
	
	const onImageSelect = (media) => {
		if ( ! media || ! media.url ) {
			removeImage();
			return;
		}
		setAttributes({imageId: media.id, imageUrl: media.url, alt: media.alt});
	}

	const onUploadError = ( message ) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	}

	const removeImage = () => {
		setAttributes( {
			imageId: undefined,
			imageUrl: undefined,
			alt: '',
		} );
	}

	useEffect( () => {
		if ( isTemporaryImage(imageId, imageUrl) ) {
			removeImage();
		}
	}, [] );

	useEffect( () => {
		if (isBlobURL(imageUrl)) {
			setTemporaryURL( imageUrl );
			return;
		} 
		else if (imageUrl) imageRef.current?.focus();
		
		revokeBlobURL( temporaryURL );
	}, [ imageUrl ] );

	// BLURB image (link)
	const [ isEditingLink, setIsEditingLink ] = useState( false );	
	const opensInNewTab = linkTarget === '_blank'

	useEffect( () => {
		if ( ! isSelected ) {
			setIsEditingLink( false );
		}
	}, [ isSelected ] );

	const startLinkEditing = (event) => {
		event.preventDefault();
		setIsEditingLink( true );
	}

	const unlink = () => {
		setAttributes( {
			link: undefined,
			linkTarget: undefined,
			linkRel: undefined,
		} );
		setIsEditingLink( false );
	}

	// BLURB output
	const imageStyle= {
		width, height
	}
	const imageOutput = <img ref={imageRef} src={imageUrl} alt={alt} style={imageStyle}/>;

    return (
		<>
			<InspectorControls>					
				<PanelBody title={ __( 'Blurb Settings', 'jc-simple-blurb' ) }>
					<ToggleControl
						label={ __( 'Allow inserting new blocks' ) }
						checked={ !! allowBlocks }
						onChange={ onAllowBlocksChange }
					/>
					<UnitControl
						label={ __( 'Max Width' ) }
						labelPosition="edge"
						value={ maxWidth || '' }
						onChange={ ( nextWidth ) => {
							nextWidth =
								0 > parseFloat( nextWidth ) ? '0' : nextWidth;
							setAttributes( { maxWidth: nextWidth } );
						} }
						units={ widthUnits }
					/>
				</PanelBody>
				{ imageUrl && !isBlobURL(imageUrl) &&
					<PanelBody title={__('Image Settings')}>		
						<ToggleControl
							label={ __( 'Image Effect' ) }
							checked={ !! imageHasEffect }
							onChange={ onImageHasEffectChange }
						/>
						<TextareaControl
							label={__('Alt text (alternative text)')}
							value={alt}
							onChange={onAltChange}
							help={
								<>
									<ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
										{ __(
											'Describe the purpose of the image'
										) }
									</ExternalLink>
									{ __(
										'Leave empty if the image is purely decorative.'
									) }
								</>
							}
						/>
						<ImageSizeControl
							onChange={ ( value ) => setAttributes( value ) }
							width={ width }
							height={ height }
							imageWidth={ (image && image.media_details && image.media_details.width) || undefined } 
							imageHeight={ (image && image.media_details && image.media_details.height) || undefined }
						/>			
					</PanelBody>
				}
			</InspectorControls>
			{ imageUrl && !isBlobURL(imageUrl) && link &&
				<InspectorControls __experimentalGroup="advanced">
					<TextControl
						label={ __( 'Link rel' ) }
						value={ linkRel || '' }
						onChange={ ( value ) => setAttributes( { linkRel: value } ) }
					/>
				</InspectorControls>
			}
			{ imageUrl && 
				<BlockControls group="inline">
					<MediaReplaceFlow
						name={__('Replace Image', 'jc-simple-blurb')}
						mediaId={imageId}
						mediaUrl={imageUrl}
						accept="image/*"
						allowedTypes={ ['image'] }
						onSelect={onImageSelect} 
						onSelectURL={(url) => {setAttributes({imageId: undefined, imageUrl: url, alt: ''})}}
						onError={onUploadError}
					/>
					<AlignmentControl
						value={ imageAlign }
						onChange={ ( nextAlign ) => {
							setAttributes( { imageAlign: nextAlign } );
						} }
					/>
					{ ! link && (
						<ToolbarButton
							name="link"
							icon={ linkIcon }
							title={ __( 'Link' ) }
							//shortcut={ displayShortcut.primary( 'k' ) }
							onClick={ startLinkEditing }
						/>
					) }
					{ link && (
						<ToolbarButton
							name="link"
							icon={ linkOff }
							title={ __( 'Unlink' ) }
							//shortcut={ displayShortcut.primaryShift( 'k' ) }
							onClick={ unlink }
							isActive={ true }
						/>
					) }
					<ToolbarButton 
						icon="trash"
						label={__('Remove Image', 'jc-simple-blurb')}
						onClick={removeImage}
					/>
				</BlockControls>
			}
			{ isSelected && imageUrl && ( link || isEditingLink ) &&
				<Popover
					position="bottom center"
					onClose={ () => {
						setIsEditingLink( false );
						imageRef.current?.focus();
					}}
					anchorRef={ imageRef?.current }
				>
					<LinkControl
							className="wp-block-navigation-link__inline-link-input"
							value={ { url:link, opensInNewTab } }
							onChange={ (value) => setAttributes({link:value.url, linkTarget: value.opensInNewTab ? '_blank' : undefined }) }
							onRemove={ () => {
								unlink();
								imageRef.current?.focus();
							} }
							forceIsEditingLink={ isEditingLink }
						/>
				</Popover>
			}
			<div {...blockProps}>
                <div className={`jc-blurb-image${isBlobURL(imageUrl) ? ' is-image-loading' : ''}`}>
                    { imageUrl && link && <a href={link} target={linkTarget} rel={linkRel}> { imageOutput } </a> }
					{ imageUrl && (!link || isEditingLink) && imageOutput }
                    { isBlobURL(imageUrl) && <Spinner/> }
                    <MediaPlaceholder 
                        accept="image/*"
                        allowedTypes={ ['image'] }
                        icon={<BlockIcon icon={ icon }/>} 
                        onSelect={onImageSelect} 
                        onSelectURL={(url) => {setAttributes({imageId: undefined, imageUrl: url, alt: ''})}}
                        onError={onUploadError}
                        disableMediaButtons={ imageUrl }
                        notices={ noticeUI }
                    />
                </div>
                <div className="jc-blurb-info">
                    <InnerBlocks
                        allowedBlocks={ ['core/paragraph', 'core/list'] } 
                        templateLock ={ allowBlocks ? false : 'all' }
                        template ={ [
                            ['core/heading', {
                                className:"jc-blurb-title",
                                level: 4,
								placeholder: __('Blurb Title', 'jc-simple-blurb')
                                }],
                            ['core/paragraph', {
                                className:"jc-blurb-description",
                                placeholder: __('Blurb Content', 'jc-simple-blurb')
                            }]
                        ] }
                    />
                </div>
			</div>
		</>
	);
};

export default withNotices( Edit );