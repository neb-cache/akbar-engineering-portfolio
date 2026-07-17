-- Idempotent seed data for Akbar Aulia Ramadhan's portfolio.

insert into public.experiences (id, company, title, work_mode, start_date, end_date, is_current, summary, sort_order)
values
('10000000-0000-4000-8000-000000000001', 'PT Sinergia Beaute Indonesia', 'Principal Full-Stack & Systems Engineer', 'hybrid', '2026-01-01', null, true, 'Leading architecture, platform modernization, enterprise integration, infrastructure supervision, and full-stack delivery across business-critical systems.', 0),
('10000000-0000-4000-8000-000000000002', 'PT Sinergia Beaute Indonesia', 'Full-Stack Engineer — ERP Integration & Business Systems', 'on-site', '2024-10-01', '2025-12-31', false, 'Built ERP-integrated business applications, managed legacy mobile delivery, coordinated vendors, and supported operational system modernization.', 1),
('10000000-0000-4000-8000-000000000003', 'Core Initiative Studio', 'Full-Stack Software Engineer & Technical Lead', 'hybrid', '2023-04-01', '2024-09-30', false, 'Delivered production systems across fintech, retail, education, hospitality, and international client projects while leading software engineering interns.', 2)
on conflict (id) do update set company=excluded.company, title=excluded.title, work_mode=excluded.work_mode, start_date=excluded.start_date, end_date=excluded.end_date, is_current=excluded.is_current, summary=excluded.summary, sort_order=excluded.sort_order;

delete from public.experience_highlights where experience_id in ('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000003');
delete from public.experience_technologies where experience_id in ('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000003');

insert into public.experience_highlights (experience_id, content, sort_order) values
('10000000-0000-4000-8000-000000000001','Leading the architecture and end-to-end delivery of a centralized Golang Gin BFF serving HR, Sales, E-commerce, Flutter Mobile Apps V2, and IT Monitoring.',0),
('10000000-0000-4000-8000-000000000001','Designing a unified integration layer with ERPNext/Frappe as the central source of truth for enterprise data and workflows.',1),
('10000000-0000-4000-8000-000000000001','Leading Mobile Apps V2 architecture, backend integration, release readiness, and Android/iOS delivery.',2),
('10000000-0000-4000-8000-000000000001','Supervising Ubuntu, Docker, Rancher, CI/CD, monitoring, security, and incident response operations.',3),
('10000000-0000-4000-8000-000000000001','Resolved a crypto-mining incident, reducing CPU utilization from approximately 100% to 5% through root-cause analysis and security hardening.',4),
('10000000-0000-4000-8000-000000000002','Built a real-time integration layer between legacy systems and ERPNext using Laravel and React.js, reducing manual work by up to 80%.',0),
('10000000-0000-4000-8000-000000000002','Managed external mobile vendors across delivery, QA, issue resolution, and releases.',1),
('10000000-0000-4000-8000-000000000002','Owned backend integration, testing, deployment, and Google Play Store and Apple App Store releases.',2),
('10000000-0000-4000-8000-000000000002','Translated manual business workflows into integrated digital processes.',3),
('10000000-0000-4000-8000-000000000003','Contributed to a Golang transaction reconciliation system for Artajasa’s ATM Bersama network.',0),
('10000000-0000-4000-8000-000000000003','Developed a multi-outlet Point of Sale platform and Learning Management Systems for multiple schools.',1),
('10000000-0000-4000-8000-000000000003','Delivered Flutter mobile applications for hotels in Jakarta and Bandung.',2),
('10000000-0000-4000-8000-000000000003','Led a software engineering internship team through task assignment, reviews, and technical guidance.',3),
('10000000-0000-4000-8000-000000000003','Collaborated with international clients and cross-border stakeholders to deliver production systems.',4);

insert into public.experience_technologies (experience_id, name, sort_order)
select e.id, tech.name, tech.ord - 1
from (values
  ('10000000-0000-4000-8000-000000000001'::uuid, array['Golang','Gin','Next.js','TypeScript','Flutter','ERPNext','Frappe','Python','Docker','Ubuntu','Rancher']),
  ('10000000-0000-4000-8000-000000000002'::uuid, array['Laravel','React.js','ERPNext','Frappe','Flutter','MySQL','REST APIs','Docker']),
  ('10000000-0000-4000-8000-000000000003'::uuid, array['Golang','Laravel','Vue.js','React.js','Flutter','Python','MySQL','PostgreSQL','Docker'])
) as e(id, technologies)
cross join lateral unnest(e.technologies) with ordinality as tech(name, ord);

insert into public.projects (id, slug, title, short_description, description, role, company, client_name, project_type, status, featured, confidential, sort_order)
values
('20000000-0000-4000-8000-000000000001','centralized-enterprise-bff','Centralized Enterprise BFF','A centralized Golang Gin backend-for-frontend layer serving five enterprise platforms while protecting a critical ERP core.','Designed and developed a centralized BFF architecture connecting HR, Sales, Web E-commerce, Flutter Mobile Apps V2, and IT Monitoring with ERPNext/Frappe. It standardizes authentication, validation, contracts, errors, rate limiting, orchestration, observability, and fallback behavior.','Principal Full-Stack & Systems Engineer','PT Sinergia Beaute Indonesia',null,'Enterprise Platform','published',true,true,0),
('20000000-0000-4000-8000-000000000002','atm-bersama-reconciliation','ATM Bersama Transaction Reconciliation System','Golang-based reconciliation workflows supporting transaction matching and discrepancy analysis for Artajasa’s ATM Bersama network.','Contributed to transaction reconciliation workflows supporting matching, mismatch identification, reconciliation operations, settlement-related data processing, and reporting.','Full-Stack Software Engineer','Core Initiative Studio','Artajasa','Fintech / Banking Infrastructure','published',true,true,1),
('20000000-0000-4000-8000-000000000003','smart-sales-platform','Smart Sales Platform','A Next.js-based sales platform integrated with ERP workflows and operational automation.','Developed an internal sales application that simplifies ERP workflows for non-technical users, integrates centralized backend services, and automates repetitive sales processes.','Principal Full-Stack & Systems Engineer','PT Sinergia Beaute Indonesia',null,'Internal Business Platform','published',true,true,2),
('20000000-0000-4000-8000-000000000004','mobile-apps-v2','Mobile Apps V2','A new Flutter-based mobile application integrated with centralized enterprise services and ERP workflows.','Led architecture and development of a second-generation Flutter mobile application including UI implementation, API integration, authentication, release readiness, and Android/iOS delivery.','Principal Full-Stack & Systems Engineer','PT Sinergia Beaute Indonesia',null,'Mobile Application','published',true,true,3),
('20000000-0000-4000-8000-000000000005','smart-courier-ai','Smart Courier AI','An intelligent courier navigation simulation combining pathfinding, weather-aware routing, machine learning, neural networks, and decision algorithms.','Built a Streamlit simulation combining BFS and A* pathfinding, OpenStreetMap visualization, weather-aware routing, energy prediction, and a Minimax decision mini-game.','AI Project Developer',null,null,'Artificial Intelligence / Academic Project','published',true,false,4),
('20000000-0000-4000-8000-000000000006','multi-school-lms','Multi-School Learning Management Systems','Learning Management System platforms built for multiple schools.','Developed LMS platforms covering user management, learning content, assignments, assessments, academic workflows, and school administration features.','Full-Stack Software Engineer','Core Initiative Studio',null,'Education Technology','published',true,false,5)
on conflict (id) do update set slug=excluded.slug,title=excluded.title,short_description=excluded.short_description,description=excluded.description,role=excluded.role,company=excluded.company,client_name=excluded.client_name,project_type=excluded.project_type,status=excluded.status,featured=excluded.featured,confidential=excluded.confidential,sort_order=excluded.sort_order;

delete from public.project_technologies where project_id::text like '20000000-0000-4000-8000-00000000000%';
delete from public.project_highlights where project_id::text like '20000000-0000-4000-8000-00000000000%';

insert into public.project_technologies (project_id, name, sort_order)
select p.id, tech.name, tech.ord - 1 from (values
('20000000-0000-4000-8000-000000000001'::uuid,array['Golang','Gin','ERPNext','Frappe','PostgreSQL','REST APIs','Docker','Rancher']),
('20000000-0000-4000-8000-000000000002'::uuid,array['Golang','MySQL','REST APIs','Financial Reconciliation']),
('20000000-0000-4000-8000-000000000003'::uuid,array['Next.js','TypeScript','Golang','ERPNext','REST APIs','Workflow Automation']),
('20000000-0000-4000-8000-000000000004'::uuid,array['Flutter','Dart','Golang','REST APIs','Android','iOS']),
('20000000-0000-4000-8000-000000000005'::uuid,array['Python','Streamlit','BFS','A*','Machine Learning','Neural Network','OpenStreetMap','Minimax','Alpha-Beta Pruning']),
('20000000-0000-4000-8000-000000000006'::uuid,array['Laravel','Vue.js','MySQL','REST APIs','JavaScript'])
) as p(id, technologies) cross join lateral unnest(p.technologies) with ordinality as tech(name, ord);

insert into public.project_highlights (project_id, content, sort_order)
select p.id, item.content, item.ord - 1 from (values
('20000000-0000-4000-8000-000000000001'::uuid,array['Centralized integration for five platforms.','Reduced direct application traffic to ERP.','Standardized validation, authentication, error handling, and API contracts.','Added rate limiting, fallback, and orchestration controls.']),
('20000000-0000-4000-8000-000000000002'::uuid,array['Supported reconciliation of financial transaction records.','Helped identify mismatched transaction data.','Contributed to operational reporting workflows.']),
('20000000-0000-4000-8000-000000000003'::uuid,array['Simplified complex ERP workflows.','Improved usability for sales and operations.','Reduced repetitive manual operations.']),
('20000000-0000-4000-8000-000000000004'::uuid,array['Cross-platform Android and iOS delivery.','Centralized backend integration.','Coordinated production readiness and releases.']),
('20000000-0000-4000-8000-000000000005'::uuid,array['Implemented intelligent route selection.','Added weather-aware routing risk.','Built energy consumption prediction.','Combined classical AI and machine learning approaches.']),
('20000000-0000-4000-8000-000000000006'::uuid,array['Supported multiple schools.','Implemented academic content and assignment workflows.','Built user and role management.','Delivered full-stack education platforms.'])
) as p(id, highlights) cross join lateral unnest(p.highlights) with ordinality as item(content, ord);

insert into public.skills (name, category, sort_order)
select name, category, ord - 1 from (values
('Backend',array['Golang','Gin','Laravel','FastAPI','Django','REST APIs','BFF Architecture','API Integration']),
('Frontend',array['Next.js','React.js','Vue.js','TypeScript','JavaScript','Tailwind CSS','Responsive Web Design']),
('Mobile',array['Flutter','Dart','Android Delivery','iOS Delivery']),
('AI & Automation',array['Python','AI-assisted applications','Machine Learning','Neural Networks','Workflow Automation','Intelligent Routing']),
('ERP & Integration',array['ERPNext','Frappe','ERP Integration','Business Process Automation','Data Synchronization']),
('Infrastructure & DevOps',array['Ubuntu','Docker','Rancher','CI/CD','Monitoring','Security Hardening','Incident Response','Production Troubleshooting']),
('Database',array['PostgreSQL','MySQL']),
('Engineering Leadership',array['Technical Leadership','Infrastructure Supervision','Vendor Management','Cross-functional Collaboration','Cross-border Collaboration','Release Management','Project Ownership'])
) as groups(category, names) cross join lateral unnest(groups.names) with ordinality as skill(name, ord)
on conflict (name, category) do update set sort_order=excluded.sort_order;

insert into public.site_settings (key, value) values
('hero', '{"name":"Akbar Aulia Ramadhan","title":"Principal Full-Stack & Systems Engineer"}'::jsonb),
('availability', '{"available":true,"message":"Open to discussing high-impact engineering work"}'::jsonb)
on conflict (key) do update set value=excluded.value;
