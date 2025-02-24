-- Drop existing tables if they exist
DROP TABLE IF EXISTS seed_questions;
DROP TABLE IF EXISTS chapters;
DROP TABLE IF EXISTS courses;

-- Create the courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Create the chapters table (linked to courses)
CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

-- Create the seed_questions table (linked to chapters)
CREATE TABLE seed_questions (
    id SERIAL PRIMARY KEY,
    chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    question TEXT NOT NULL
);

-- Insert sample real estate courses
INSERT INTO courses (name, description) VALUES 
    ('Real Estate Fundamentals', 'Learn the basics of real estate transactions, contracts, and laws.'),
    ('Property Valuation & Investment', 'Understand how to evaluate property value and make smart investments.'),
    ('Real Estate Finance & Mortgages', 'Dive into mortgages, loans, and financial strategies in real estate.'),
    ('Real Estate Law & Ethics', 'Master legal principles and ethical considerations in real estate.'),
    ('Real Estate Marketing & Sales', 'Learn how to market and sell real estate effectively.');

-- Insert sample chapters for each real estate course (10 per course)
INSERT INTO chapters (course_id, name) VALUES 
    -- Real Estate Fundamentals
    (1, 'Understanding Real Estate Markets'),
    (1, 'Types of Property Ownership'),
    (1, 'Key Real Estate Terminologies'),
    (1, 'Real Estate Transactions & Closings'),
    (1, 'The Role of Real Estate Agents'),
    (1, 'Home Buying Process'),
    (1, 'Property Inspection and Appraisals'),
    (1, 'Real Estate Taxes and Insurance'),
    (1, 'Real Estate Technology and Trends'),
    (1, 'Sustainable & Green Real Estate'),

    -- Property Valuation & Investment
    (2, 'Principles of Property Valuation'),
    (2, 'Real Estate Market Analysis'),
    (2, 'Rental Income Properties'),
    (2, 'Flipping Houses: Strategies and Risks'),
    (2, 'Commercial vs. Residential Properties'),
    (2, 'Real Estate Investment Trusts (REITs)'),
    (2, 'Financing an Investment Property'),
    (2, 'The 1031 Exchange in Real Estate'),
    (2, 'Understanding Cap Rates & ROI'),
    (2, 'Risk Management in Real Estate Investment'),

    -- Real Estate Finance & Mortgages
    (3, 'Introduction to Real Estate Financing'),
    (3, 'Types of Mortgages'),
    (3, 'Qualifying for a Mortgage Loan'),
    (3, 'Government-Backed Loans (FHA, VA, USDA)'),
    (3, 'Understanding Interest Rates'),
    (3, 'Adjustable vs. Fixed-Rate Mortgages'),
    (3, 'Loan Amortization & Payment Structures'),
    (3, 'Foreclosure and Loan Defaults'),
    (3, 'Real Estate Syndication & Crowdfunding'),
    (3, 'Refinancing and Loan Modifications'),

    -- Real Estate Law & Ethics
    (4, 'Introduction to Real Estate Law'),
    (4, 'Fair Housing Laws and Regulations'),
    (4, 'Contract Law in Real Estate'),
    (4, 'Landlord-Tenant Laws'),
    (4, 'Legal Issues in Property Management'),
    (4, 'Zoning and Land Use Laws'),
    (4, 'Title and Deed Restrictions'),
    (4, 'Understanding Easements and Encroachments'),
    (4, 'Legal Responsibilities of Real Estate Agents'),
    (4, 'Ethics in Real Estate Transactions'),

    -- Real Estate Marketing & Sales
    (5, 'Real Estate Branding and Personal Marketing'),
    (5, 'Digital Marketing Strategies for Real Estate'),
    (5, 'Generating Leads in Real Estate'),
    (5, 'Effective Real Estate Listings'),
    (5, 'Open House Strategies'),
    (5, 'The Psychology of Selling Real Estate'),
    (5, 'Negotiation Tactics for Real Estate Agents'),
    (5, 'Working with First-Time Home Buyers'),
    (5, 'Handling Multiple Offers and Bidding Wars'),
    (5, 'Building a Referral-Based Real Estate Business');

-- Insert sample real estate seed questions (5 per chapter)
INSERT INTO seed_questions (chapter_id, question) VALUES
    (1, 'What are key factors affecting understanding real estate markets?'),
    (1, 'How does understanding real estate markets impact real estate transactions?'),
    (1, 'What are common legal considerations in understanding real estate markets?'),
    (1, 'What are the financial implications of understanding real estate markets?'),
    (1, 'How can understanding real estate markets influence property valuation?'),

    (2, 'What are key factors affecting types of property ownership?'),
    (2, 'How does types of property ownership impact real estate transactions?'),
    (2, 'What are common legal considerations in types of property ownership?'),
    (2, 'What are the financial implications of types of property ownership?'),
    (2, 'How can types of property ownership influence property valuation?'),

    (3, 'What are key factors affecting key real estate terminologies?'),
    (3, 'How does key real estate terminologies impact real estate transactions?'),
    (3, 'What are common legal considerations in key real estate terminologies?'),
    (3, 'What are the financial implications of key real estate terminologies?'),
    (3, 'How can key real estate terminologies influence property valuation?'),

    (4, 'What are key factors affecting real estate transactions & closings?'),
    (4, 'How does real estate transactions & closings impact real estate transactions?'),
    (4, 'What are common legal considerations in real estate transactions & closings?'),
    (4, 'What are the financial implications of real estate transactions & closings?'),
    (4, 'How can real estate transactions & closings influence property valuation?'),

    (5, 'What are key factors affecting the role of real estate agents?'),
    (5, 'How does the role of real estate agents impact real estate transactions?'),
    (5, 'What are common legal considerations in the role of real estate agents?'),
    (5, 'What are the financial implications of the role of real estate agents?'),
    (5, 'How can the role of real estate agents influence property valuation?'),

    (6, 'What are key factors affecting home buying process?'),
    (6, 'How does home buying process impact real estate transactions?'),
    (6, 'What are common legal considerations in home buying process?'),
    (6, 'What are the financial implications of home buying process?'),
    (6, 'How can home buying process influence property valuation?'),

    (7, 'What are key factors affecting property inspection and appraisals?'),
    (7, 'How does property inspection and appraisals impact real estate transactions?'),
    (7, 'What are common legal considerations in property inspection and appraisals?'),
    (7, 'What are the financial implications of property inspection and appraisals?'),
    (7, 'How can property inspection and appraisals influence property valuation?'),

    (8, 'What are key factors affecting real estate taxes and insurance?'),
    (8, 'How does real estate taxes and insurance impact real estate transactions?'),
    (8, 'What are common legal considerations in real estate taxes and insurance?'),
    (8, 'What are the financial implications of real estate taxes and insurance?'),
    (8, 'How can real estate taxes and insurance influence property valuation?'),

    (9, 'What are key factors affecting real estate technology and trends?'),
    (9, 'How does real estate technology and trends impact real estate transactions?'),
    (9, 'What are common legal considerations in real estate technology and trends?'),
    (9, 'What are the financial implications of real estate technology and trends?'),
    (9, 'How can real estate technology and trends influence property valuation?'),

    (10, 'What are key factors affecting sustainable & green real estate?'),
    (10, 'How does sustainable & green real estate impact real estate transactions?'),
    (10, 'What are common legal considerations in sustainable & green real estate?'),
    (10, 'What are the financial implications of sustainable & green real estate?'),
    (10, 'How can sustainable & green real estate influence property valuation?');
