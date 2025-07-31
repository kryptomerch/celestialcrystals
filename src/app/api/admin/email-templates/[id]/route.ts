import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

function isAdminEmail(email: string): boolean {
  const adminEmails = ['dhruvshah8888@gmail.com', 'admin@celestialcrystals.com'];
  return adminEmails.includes(email.toLowerCase());
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { subject, html } = await request.json();
    const resolvedParams = await params;
    const templateId = resolvedParams.id;

    // Map template IDs to file paths
    const templateFiles: Record<string, string> = {
      'welcome': 'src/lib/email-templates/welcome.ts',
      'newsletter': 'src/lib/email-templates/newsletter.ts',
      'order-confirmation': 'src/lib/email-templates/order-confirmation.ts'
    };

    const filePath = templateFiles[templateId];
    if (!filePath) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Read the current template file
    const fullPath = path.join(process.cwd(), filePath);
    let fileContent = fs.readFileSync(fullPath, 'utf8');

    // Update the subject in the template
    if (subject) {
      // Find and replace the subject line
      fileContent = fileContent.replace(
        /subject:\s*['"`]([^'"`]*?)['"`]/,
        `subject: \`${subject}\``
      );
    }

    // Update the HTML content
    if (html) {
      // Find the content section and replace it
      const contentStart = fileContent.indexOf('const content = `');
      const contentEnd = fileContent.indexOf('`;', contentStart);

      if (contentStart !== -1 && contentEnd !== -1) {
        const beforeContent = fileContent.substring(0, contentStart);
        const afterContent = fileContent.substring(contentEnd + 2);

        fileContent = beforeContent + `const content = \`${html}\`` + afterContent;
      }
    }

    // Write the updated content back to the file
    fs.writeFileSync(fullPath, fileContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Template updated successfully'
    });

  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
