import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json(
        { error: 'Chưa cấu hình API key' },
        { status: 500 }
      );
    }

    // Add strong randomness to prevent duplicate responses
    const topics = [
      "cuộc sống", "thành công", "động lực", "ước mơ", "công việc", "mối quan hệ", "sự tồn tại", 
      "thành tựu", "mục tiêu", "hạnh phúc", "năng suất", "tự hoàn thiện", 
      "cảm hứng", "bền bỉ", "tham vọng", "thất bại", "xã hội", "kỳ vọng",
      "sự nghiệp", "tiền bạc", "danh vọng", "tình yêu", "tình bạn", "gia đình", "sức khỏe", "tuổi tác"
    ];
    
    const styles = [
      "thẳng thắn tàn nhẫn", "châm biếm dí dỏm", "hài hước đen tối", "hoài nghi hiện thực",
      "mỉa mai sắc sảo", "cay đắng hài hước", "chế giễu thông minh", "bi quan khôn ngoan"
    ];
    
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const timestamp = Date.now();
    const randomSeed = Math.floor(Math.random() * 100000);
    
    const prompt = `Tạo một câu trích dẫn phản động lực ${randomStyle} dưới 20 từ về ${randomTopic}. 
    Hãy làm cho nó bi quan độc đáo và đáng nhớ. Không được khuyến khích hoặc hy vọng.
    Hãy sáng tạo và khác biệt với các câu trích dẫn thông thường. Thời gian: ${timestamp}, Seed: ${randomSeed}
    Chỉ trả về văn bản trích dẫn bằng TIẾNG VIỆT mà không có dấu ngoặc kép hoặc bất kỳ định dạng bổ sung nào.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 1.2,
          topK: 100,
          topP: 0.8,
          maxOutputTokens: 50,
          candidateCount: 1,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      
      // Fall back to mock quotes if API fails
      const mockQuotes = [
        "Bởi vì không gì nói 'thành tựu' hơn việc tham gia cuộc đua chuột.",
        "Mơ lớn, để thất vọng của bạn có thể ngoạn mục tương xứng.",
        "Thành công: nghệ thuật thuyết phục bản thân bạn không phải kẻ thất bại.",
        "Động lực là tạm thời, nhưng tầm thường là mãi mãi.",
        "Tại sao hướng tới những vì sao khi bạn có thể chấp nhận rãnh cống?",
        "Tiềm năng của bạn là vô hạn, có nghĩa là nó cũng vô nghĩa.",
        "Mỗi thất bại là một bước gần hơn đến việc chấp nhận bạn không đặc biệt.",
        "Tin vào bản thân, vì không ai khác sẽ làm thế.",
        "Cuộc sống quá ngắn để lãng phí vào những kỳ vọng phi thực tế.",
        "Kiên trì chỉ là bướng bỉnh với một đội ngũ marketing tốt hơn.",
        "Theo đuổi ước mơ của bạn, chúng biết đường đến thất vọng.",
        "Bạn bỏ lỡ 100% những cú đánh bạn không thực hiện, và hầu hết những cú bạn thực hiện.",
        "Làm việc chăm chỉ cuối cùng sẽ được đền đáp, nhưng lười biếng được đền đáp ngay.",
        "Điều duy nhất đứng giữa bạn và thành công là mọi thứ.",
        "Vùng thoải mái của bạn được gọi như vậy vì một lý do."
      ];
      
      const quote = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];
      return NextResponse.json({ quote });
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      const quote = data.candidates[0].content.parts[0].text.trim();
      return NextResponse.json({ quote });
    } else {
      // Fall back to mock quote if response structure is unexpected
      const mockQuotes = [
        "Bởi vì không gì nói 'thành tựu' hơn việc tham gia cuộc đua chuột.",
        "Mơ lớn, để thất vọng của bạn có thể ngoạn mục tương xứng.",
        "Thành công: nghệ thuật thuyết phục bản thân bạn không phải kẻ thất bại."
      ];
      const quote = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];
      return NextResponse.json({ quote });
    }
    
  } catch (error) {
    console.error('Error generating quote:', error);
    
    // Fall back to mock quotes on any error
    const mockQuotes = [
      "Bởi vì không gì nói 'thành tựu' hơn việc tham gia cuộc đua chuột.",
      "Mơ lớn, để thất vọng của bạn có thể ngoạn mục tương xứng.",
      "Thành công: nghệ thuật thuyết phục bản thân bạn không phải kẻ thất bại.",
      "Động lực là tạm thời, nhưng tầm thường là mãi mãi.",
      "Tại sao hướng tới những vì sao khi bạn có thể chấp nhận rãnh cống?"
    ];
    
    const quote = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];
    return NextResponse.json({ quote });
  }
}
