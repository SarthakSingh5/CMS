import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PageViewer = () => {
    const { id } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const { data } = await axios.get('/api/content');
                const foundPage = data.find(p => p._id === id);
                setPage(foundPage);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [id]);

    if (loading) return <div className="loading-screen">Loading Page...</div>;
    if (!page) return <div className="error-screen">Page not found</div>;

    const renderBlock = (block, index) => {
        switch (block.type) {
            case 'hero':
                return (
                    <section key={index} className="block-hero" style={{ background: block.content.bg }}>
                        <div className="container-sm">
                            <h1>{block.content.title}</h1>
                            <p>{block.content.subtitle}</p>
                        </div>
                    </section>
                );
            case 'features':
                return (
                    <section key={index} className="block-features container-sm">
                        <h2>{block.content.title}</h2>
                        <div className="features-grid">
                            {block.content.items.map((item, i) => (
                                <div key={i} className="feature-card">
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'cta':
                return (
                    <section key={index} className="block-cta">
                        <div className="container-sm">
                            <h2>{block.content.title}</h2>
                            <a href={block.content.url} className="btn-cta">{block.content.buttonText}</a>
                        </div>
                    </section>
                );
            case 'testimonial':
                return (
                    <section key={index} className="block-testimonial container-sm">
                        <blockquote>"{block.content.quote}"</blockquote>
                        <div className="author">
                            <strong>{block.content.author}</strong>
                            <span>{block.content.role}</span>
                        </div>
                    </section>
                );
            case 'image':
                return (
                    <section key={index} className="block-image container-sm">
                        <img src={block.content} alt="Page Content" />
                    </section>
                );
            case 'text':
            default:
                return (
                    <section key={index} className="block-text container-sm">
                        <p>{typeof block.content === 'string' ? block.content : ''}</p>
                    </section>
                );
        }
    };

    return (
        <div className="page-viewer">
            {page.blocks && page.blocks.map((block, i) => renderBlock(block, i))}

            <style>{`
                .page-viewer { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; color: #1e293b; line-height: 1.6; }
                .container-sm { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
                
                .block-hero { 
                    padding: 6rem 1rem; text-align: center; color: white; 
                    margin-bottom: 4rem;
                }
                .block-hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.2; }
                .block-hero p { font-size: 1.5rem; opacity: 0.9; font-weight: 400; }

                .block-features { margin-bottom: 4rem; text-align: center; }
                .block-features h2 { font-size: 2.5rem; margin-bottom: 3rem; font-weight: 700; }
                .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
                .feature-card { padding: 2rem; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); transition: transform 0.2s; }
                .feature-card:hover { transform: translateY(-5px); }
                .feature-card h3 { font-size: 1.25rem; margin-bottom: 1rem; color: #6366f1; }
                
                .block-cta { background: #0f172a; color: white; padding: 5rem 1rem; text-align: center; margin-bottom: 4rem; }
                .block-cta h2 { font-size: 2.5rem; margin-bottom: 2rem; }
                .btn-cta { 
                    display: inline-block; background: #6366f1; color: white; padding: 1rem 2.5rem; 
                    font-size: 1.1rem; font-weight: 700; border-radius: 50px; text-decoration: none; 
                    transition: all 0.2s; 
                }
                .btn-cta:hover { transform: scale(1.05); background: #818cf8; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4); }

                .block-testimonial { text-align: center; margin-bottom: 4rem; padding: 0 2rem; }
                .block-testimonial blockquote { font-size: 1.8rem; font-style: italic; color: #334155; margin-bottom: 1.5rem; }
                .block-testimonial .author { display: flex; flex-direction: column; align-items: center; }
                .block-testimonial strong { font-size: 1.1rem; }
                .block-testimonial span { color: #64748b; font-size: 0.9rem; }

                .block-image { margin-bottom: 4rem; text-align: center; }
                .block-image img { max-width: 100%; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }

                .block-text { margin-bottom: 3rem; font-size: 1.15rem; color: #334155; }
            `}</style>
        </div>
    );
};

export default PageViewer;
